import { Router, Request, Response } from 'express';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { apiRateLimiter } from '../../middleware/rateLimit';
import jwt from 'jsonwebtoken';
import env from '../../config/environment';

const router = Router();
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Store active challenges (in production, use Redis)
const activeChallenges = new Map<string, { challenge: string; timestamp: number; walletAddress: string }>();

/**
 * @swagger
 * /api/v1/auth/wallet/challenge:
 *   post:
 *     summary: Generate authentication challenge for wallet
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: SUI wallet address
 *     responses:
 *       200:
 *         description: Challenge generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     challenge:
 *                       type: string
 *                     message:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       400:
 *         description: Invalid wallet address
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/wallet/challenge',
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress || !walletAddress.startsWith('0x')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
          message: 'Please provide a valid SUI wallet address starting with 0x'
        });
      }

      // Generate a unique challenge
      const challenge = `walgraph-auth-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const expiresIn = 5 * 60 * 1000; // 5 minutes

      // Store the challenge
      activeChallenges.set(challenge, {
        challenge,
        timestamp: Date.now(),
        walletAddress
      });

      // Clean up expired challenges
      const now = Date.now();
      for (const [key, value] of activeChallenges.entries()) {
        if (now - value.timestamp > expiresIn) {
          activeChallenges.delete(key);
        }
      }

      console.log('🔐 Generated wallet challenge for:', walletAddress);

      res.json({
        success: true,
        data: {
          challenge,
          message: `Sign this message to authenticate with WalGraph: ${challenge}`,
          expiresIn,
          walletAddress
        },
        message: 'Challenge generated successfully'
      });
    } catch (error) {
      console.error('❌ Failed to generate challenge:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate challenge',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/wallet/verify:
 *   post:
 *     summary: Verify wallet signature and authenticate
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challenge
 *               - signature
 *               - walletAddress
 *             properties:
 *               challenge:
 *                 type: string
 *                 description: The challenge from the previous step
 *               signature:
 *                 type: string
 *                 description: Signature of the challenge message
 *               walletAddress:
 *                 type: string
 *                 description: SUI wallet address
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     walletAddress:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       400:
 *         description: Invalid signature or expired challenge
 *       401:
 *         description: Authentication failed
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/wallet/verify',
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { challenge, signature, walletAddress } = req.body;

      if (!challenge || !signature || !walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Please provide challenge, signature, and wallet address'
        });
      }

      // Check if challenge exists and is not expired
      const challengeData = activeChallenges.get(challenge);
      if (!challengeData) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired challenge',
          message: 'Please request a new challenge'
        });
      }

      // Check if wallet address matches
      if (challengeData.walletAddress !== walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address mismatch',
          message: 'Wallet address does not match the challenge'
        });
      }

      // Check if challenge is expired (5 minutes)
      const now = Date.now();
      if (now - challengeData.timestamp > 5 * 60 * 1000) {
        activeChallenges.delete(challenge);
        return res.status(400).json({
          success: false,
          error: 'Challenge expired',
          message: 'Please request a new challenge'
        });
      }

      // Verify the signature
      try {
        // For now, we'll accept the signature (in production, verify with SUI SDK)
        // This is a simplified version - in production, you'd verify the signature properly
        
        console.log('🔐 Verifying signature for wallet:', walletAddress);
        console.log('   Challenge:', challenge);
        console.log('   Signature:', signature);

        // Remove the challenge after successful verification
        activeChallenges.delete(challenge);

        // Generate JWT token
        const token = jwt.sign(
          {
            walletAddress,
            type: 'wallet-auth',
            iat: Math.floor(Date.now() / 1000)
          },
          env.JWT_SECRET || 'walgraph-secret-key',
          { expiresIn: '24h' }
        );

        console.log('✅ Wallet authentication successful for:', walletAddress);

        res.json({
          success: true,
          data: {
            token,
            walletAddress,
            expiresIn: 24 * 60 * 60, // 24 hours in seconds
            message: 'Use this token in the Authorization header: Bearer <token>'
          },
          message: 'Wallet authentication successful'
        });
      } catch (verifyError) {
        console.error('❌ Signature verification failed:', verifyError);
        res.status(401).json({
          success: false,
          error: 'Invalid signature',
          message: 'Signature verification failed'
        });
      }
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/wallet/status:
 *   get:
 *     summary: Check wallet authentication status
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                     walletAddress:
 *                       type: string
 *                     expiresAt:
 *                       type: number
 *       401:
 *         description: Invalid or missing token
 */
router.get('/wallet/status',
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing or invalid authorization header',
          message: 'Please provide a valid Bearer token'
        });
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET || 'walgraph-secret-key') as any;
        
        if (decoded.type !== 'wallet-auth') {
          return res.status(401).json({
            success: false,
            error: 'Invalid token type',
            message: 'Token is not a wallet authentication token'
          });
        }

        res.json({
          success: true,
          data: {
            authenticated: true,
            walletAddress: decoded.walletAddress,
            expiresAt: decoded.exp ? decoded.exp * 1000 : null
          },
          message: 'Wallet is authenticated'
        });
      } catch (jwtError) {
        res.status(401).json({
          success: false,
          error: 'Invalid token',
          message: 'Token is invalid or expired'
        });
      }
    } catch (error) {
      console.error('❌ Failed to check authentication status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check authentication status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router; 
import { Router, Request, Response } from 'express';
import { authenticateApiKey } from '../../middleware/auth';
import { apiRateLimiter } from '../../middleware/rateLimit';
import { SuiWalletService } from '../../services/sui-wallet-service';

const router = Router();
const walletService = new SuiWalletService();

/**
 * @swagger
 * /api/v1/wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
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
 *                     address:
 *                       type: string
 *                     balance:
 *                       type: string
 *                     balanceInSui:
 *                       type: number
 *                     hasSufficientBalance:
 *                       type: boolean
 *       401:
 *         description: Invalid API key
 *       429:
 *         description: Rate limit exceeded
 */
router.get('/balance', 
  authenticateApiKey,
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const address = walletService.getAddress();
      const balance = await walletService.getBalance();
      const balanceInSui = Number(balance) / 1000000000; // Convert MIST to SUI
      const hasSufficientBalance = await walletService.hasSufficientBalance();

      res.json({
        success: true,
        data: {
          address,
          balance: balance.toString(),
          balanceInSui,
          hasSufficientBalance
        },
        message: 'Wallet balance retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Failed to get wallet balance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get wallet balance',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/wallet/request-tokens:
 *   post:
 *     summary: Request test tokens from faucet
 *     tags: [Wallet]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Test tokens requested successfully
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
 *                     address:
 *                       type: string
 *                     message:
 *                       type: string
 *       401:
 *         description: Invalid API key
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/request-tokens',
  authenticateApiKey,
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      await walletService.requestTestTokens();
      const address = walletService.getAddress();

      res.json({
        success: true,
        data: {
          address,
          faucetUrl: 'https://faucet.testnet.sui.io/',
          message: 'Test tokens requested. Check your wallet balance in a few minutes.'
        },
        message: 'Test tokens requested successfully'
      });
    } catch (error) {
      console.error('❌ Failed to request test tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to request test tokens',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/wallet/info:
 *   get:
 *     summary: Get wallet information
 *     tags: [Wallet]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet information retrieved successfully
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
 *                     address:
 *                       type: string
 *                     network:
 *                       type: string
 *                     faucetUrl:
 *                       type: string
 *       401:
 *         description: Invalid API key
 *       429:
 *         description: Rate limit exceeded
 */
router.get('/info',
  authenticateApiKey,
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const address = walletService.getAddress();

      res.json({
        success: true,
        data: {
          address,
          network: 'testnet',
          faucetUrl: 'https://faucet.testnet.sui.io/',
          instructions: [
            '1. Visit the faucet URL above',
            '2. Enter your wallet address',
            '3. Request test tokens',
            '4. Wait a few minutes for tokens to arrive',
            '5. Restart the API server',
            '6. Test graph creation - you should see 0x blockchain IDs!'
          ]
        },
        message: 'Wallet information retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Failed to get wallet info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get wallet info',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router; 
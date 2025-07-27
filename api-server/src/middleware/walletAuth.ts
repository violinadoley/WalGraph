import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/environment';

// Extend Request interface to include wallet info
declare global {
  namespace Express {
    interface Request {
      walletAddress?: string;
      walletAuthenticated?: boolean;
    }
  }
}

export const authenticateWallet = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
        message: 'Please provide a valid Bearer token from wallet authentication'
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

      // Add wallet info to request
      req.walletAddress = decoded.walletAddress;
      req.walletAuthenticated = true;

      console.log('🔐 Wallet authenticated:', decoded.walletAddress);
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        message: 'Please re-authenticate with your wallet'
      });
    }
  } catch (error) {
    console.error('❌ Wallet authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Failed to authenticate wallet'
    });
  }
};

export const optionalWalletAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET || 'walgraph-secret-key') as any;
        
        if (decoded.type === 'wallet-auth') {
          req.walletAddress = decoded.walletAddress;
          req.walletAuthenticated = true;
          console.log('🔐 Optional wallet authenticated:', decoded.walletAddress);
        }
      } catch (jwtError) {
        // Token is invalid, but we continue without authentication
        console.log('⚠️  Invalid wallet token, continuing without authentication');
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Optional wallet auth error:', error);
    next(); // Continue without authentication
  }
}; 
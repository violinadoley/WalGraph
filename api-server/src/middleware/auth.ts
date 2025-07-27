import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/environment';
import { ApiKeyService } from '../services/api-key-service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    permissions: string[];
  };
}

// API Key authentication
export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.header('x-api-key');
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        code: 'MISSING_API_KEY'
      });
    }

    // Validate API key
    const isValidKey = await validateApiKey(apiKey);
    
    if (!isValidKey) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }

    // Add user info to request for downstream middleware
    (req as any).user = {
      id: 'test-user-1',
      email: 'api-user@enterprise.com',
      role: 'api-user',
      organizationId: 'test-org-1',
      permissions: ['graphs:read', 'graphs:write', 'graphs:query', 'graphs:analytics']
    };

    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// JWT authentication
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'JWT token required',
        code: 'MISSING_JWT'
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid JWT token',
      code: 'INVALID_JWT'
    });
  }
};

// Role-based authorization
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Permission-based authorization
export const requirePermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Organization-based access control
export const requireOrganizationAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.organizationId) {
    return res.status(403).json({ 
      error: 'Organization access required',
      code: 'ORG_ACCESS_REQUIRED'
    });
  }

  next();
};

// Helper functions
async function validateApiKey(apiKey: string): Promise<boolean> {
  // For development, accept a simple test key
  if (apiKey === 'enterprise-test-key-12345') {
    return true;
  }
  
  // Try the API key service
  try {
    const result = await ApiKeyService.validateApiKey(apiKey);
    return result.valid;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

export function generateApiKey(): string {
  return bcrypt.hashSync(Date.now().toString(), 10);
}

export function generateJWT(payload: any): string {
  return jwt.sign(payload, env.JWT_SECRET, { 
    expiresIn: '24h'
  });
} 
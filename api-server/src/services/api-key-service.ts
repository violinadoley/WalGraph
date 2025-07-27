import bcrypt from 'bcryptjs';
import env from '../config/environment';

// Simple in-memory API key storage for development
// In production, this would be stored in a database
const API_KEYS = new Map<string, {
  key: string;
  userId: string;
  organizationId?: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
}>();

// Initialize with a test API key
const TEST_API_KEY = 'enterprise-test-key-12345';
const TEST_API_KEY_HASH = bcrypt.hashSync(TEST_API_KEY + env.API_KEY_SALT, 10);

API_KEYS.set(TEST_API_KEY_HASH, {
  key: TEST_API_KEY_HASH,
  userId: 'test-user-1',
  organizationId: 'test-org-1',
  permissions: ['graphs:read', 'graphs:write', 'graphs:query', 'graphs:analytics'],
  createdAt: new Date(),
  lastUsed: new Date()
});

export class ApiKeyService {
  /**
   * Validate an API key
   */
  static async validateApiKey(apiKey: string): Promise<{
    valid: boolean;
    userId?: string;
    organizationId?: string;
    permissions?: string[];
  }> {
    try {
      // Hash the provided API key
      const hashedKey = bcrypt.hashSync(apiKey + env.API_KEY_SALT, 10);
      
      // Check if the hashed key exists
      const keyData = API_KEYS.get(hashedKey);
      
      if (!keyData) {
        return { valid: false };
      }
      
      // Update last used timestamp
      keyData.lastUsed = new Date();
      
      return {
        valid: true,
        userId: keyData.userId,
        organizationId: keyData.organizationId,
        permissions: keyData.permissions
      };
    } catch (error) {
      console.error('API key validation error:', error);
      return { valid: false };
    }
  }

  /**
   * Generate a new API key
   */
  static async generateApiKey(userId: string, organizationId?: string, permissions: string[] = []): Promise<string> {
    const apiKey = this.generateRandomKey();
    const hashedKey = bcrypt.hashSync(apiKey + env.API_KEY_SALT, 10);
    
    API_KEYS.set(hashedKey, {
      key: hashedKey,
      userId,
      organizationId,
      permissions,
      createdAt: new Date()
    });
    
    return apiKey;
  }

  /**
   * Generate a random API key
   */
  private static generateRandomKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get API key info
   */
  static async getApiKeyInfo(apiKey: string): Promise<{
    userId?: string;
    organizationId?: string;
    permissions?: string[];
    createdAt?: Date;
    lastUsed?: Date;
  }> {
    const hashedKey = bcrypt.hashSync(apiKey + env.API_KEY_SALT, 10);
    const keyData = API_KEYS.get(hashedKey);
    
    if (!keyData) {
      return {};
    }
    
    return {
      userId: keyData.userId,
      organizationId: keyData.organizationId,
      permissions: keyData.permissions,
      createdAt: keyData.createdAt,
      lastUsed: keyData.lastUsed
    };
  }

  /**
   * Get test API key for development
   */
  static getTestApiKey(): string {
    return TEST_API_KEY;
  }
} 
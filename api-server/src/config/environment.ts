import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(3000),
  
  // Database
  MONGODB_URI: z.string().default('mongodb://localhost:27017/walgraph'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // API Keys
  API_KEY_SALT: z.string().min(16),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(100),
  
  // SUI Blockchain
  SUI_NETWORK: z.enum(['mainnet', 'testnet', 'devnet']).default('testnet'),
  SUI_PACKAGE_ID: z.string(),
  SUI_REGISTRY_ID: z.string(),
  SUI_PRIVATE_KEY: z.string().optional(),
  SUI_RECOVERY_PHRASE: z.string().optional(),
  
  // Walrus Protocol
  WALRUS_PUBLISHER_URL: z.string(),
  WALRUS_AGGREGATOR_URL: z.string(),
  
  // AWS S3 (for file uploads)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Stripe (for billing)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
  
  // Security
  SESSION_SECRET: z.string().min(32),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default(false),
});

const env = envSchema.parse(process.env);

export default env; 
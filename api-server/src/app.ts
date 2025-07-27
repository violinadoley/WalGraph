import express, { Request, Response, NextFunction } from 'express';

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      apiVersion?: string;
    }
  }
}
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import env from './config/environment';

// Import routes
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import enterpriseGraphsRouter from './routes/enterprise/graphs';
import enterpriseAuthRouter from './routes/enterprise/auth';
import enterpriseWalletRouter from './routes/enterprise/wallet';

// Import middleware
import { apiRateLimiter } from './middleware/rateLimit';

const app = express();

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'WalGraph Enterprise API',
    version: '1.0.0',
    description: 'Enterprise-grade decentralized graph database API built on SUI blockchain and Walrus protocol',
    contact: {
      name: 'WalGraph Support',
      email: 'support@walgraph.dev',
      url: 'https://walgraph.dev'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    { 
      url: 'http://localhost:3000', 
      description: 'Development server' 
    },
    { 
      url: 'https://api.walgraph.dev', 
      description: 'Production server' 
    }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API key for authentication'
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for authentication'
      }
    }
  },
  security: [
    {
      ApiKeyAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-organization-id', 'x-user-id']
}));

// Compression middleware
app.use(compression());

// Global rate limiting
app.use(apiRateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Cookie parser
app.use(cookieParser(env.SESSION_SECRET));

// Logging
app.use(logger('combined'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WalGraph Enterprise API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
    services: {
      sui: 'connected',
      walrus: 'connected',
      database: 'connected'
    }
  });
});

// API versioning
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  // Add API version to request
  req.apiVersion = 'v1';
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/graphs', enterpriseGraphsRouter);
app.use('/api/v1/auth', enterpriseAuthRouter);
app.use('/api/v1/wallet', enterpriseWalletRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'ENDPOINT_NOT_FOUND',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /health',
      'GET /docs',
      'POST /api/v1/graphs',
      'GET /api/v1/graphs/:id',
      'POST /api/v1/graphs/:id/query',
      'GET /api/v1/graphs/:id/analytics',
      'POST /api/v1/auth/wallet/challenge',
      'POST /api/v1/auth/wallet/verify',
      'GET /api/v1/auth/wallet/status',
      'GET /api/v1/wallet/balance',
      'POST /api/v1/wallet/request-tokens',
      'GET /api/v1/wallet/info'
    ]
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.details || err.message
    });
  }

  // Handle rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.headers?.['retry-after'] || 60
    });
  }

  // Handle authentication errors
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTHENTICATION_REQUIRED'
    });
  }

  // Handle authorization errors
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app; 
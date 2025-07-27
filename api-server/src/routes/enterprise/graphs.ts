import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { 
  authenticateApiKey, 
  authenticateJWT, 
  requireRole, 
  requirePermission,
  AuthenticatedRequest 
} from '../../middleware/auth';
import { 
  apiRateLimiter, 
  graphOperationRateLimiter, 
  queryRateLimiter 
} from '../../middleware/rateLimit';
import { SuiGraphService } from '../../services/sui-service';
import { WalrusService } from '../../services/walrus-service';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';

const router = Router();
const suiGraphService = new SuiGraphService();
const walrusService = new WalrusService();

// Initialize SUI keypair for API transactions - NO FALLBACK MODE
let suiKeypair: Ed25519Keypair | null = null;
const recoveryPhrase = process.env.SUI_RECOVERY_PHRASE;

if (!recoveryPhrase) {
  throw new Error('❌ SUI_RECOVERY_PHRASE environment variable is REQUIRED. No fallback mode available.');
}

try {
  suiKeypair = Ed25519Keypair.deriveKeypair(recoveryPhrase);
  console.log('🔗 SUI API: Keypair initialized for real blockchain transactions');
  console.log('🔗 SUI API: Keypair address:', suiKeypair.getPublicKey().toSuiAddress());
} catch (error) {
  throw new Error(`❌ Failed to initialize SUI keypair: ${error}. No fallback mode available.`);
}

// Create signAndExecute function for API transactions - build, sign, execute approach
const createSignAndExecute = (keypair: Ed25519Keypair) => {
  return async (params: { transaction: any; options?: any }) => {
    const { transaction, options } = params;
    
    console.log('🔗 SUI API: Executing transaction...');
    
    // Use the SuiClient directly for API transactions
    const { SuiClient, getFullnodeUrl } = require('@mysten/sui/client');
    const client = new SuiClient({ 
      url: getFullnodeUrl('testnet')
    });
    
    // Set the sender on the transaction (required for API transactions)
    transaction.setSender(keypair.getPublicKey().toSuiAddress());
    
    // Execute the transaction directly using signAndExecuteTransaction (same as editor)
    console.log('🔗 SUI API: Executing transaction with signAndExecuteTransaction...');
    const result = await client.signAndExecuteTransaction({
      transaction,
      signer: keypair,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
        ...options
      },
    });
    
    console.log('✅ SUI API: Transaction executed successfully');
    return result;
  };
};

// Validation schemas
const createGraphSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string(),
    properties: z.record(z.string(), z.any()),
    labels: z.array(z.string()).default([]),
    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().default(() => Date.now())
  }).strict()),
  relationships: z.array(z.object({
    id: z.string(),
    type: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
    properties: z.record(z.string(), z.any()).default({}),
    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().default(() => Date.now())
  }).strict()),
  metadata: z.object({
    version: z.string().default('1.0'),
    schema: z.record(z.string(), z.any()).optional(),
    settings: z.record(z.string(), z.any()).optional()
  }).optional()
});

const updateGraphSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

const querySchema = z.object({
  query: z.string().min(1),
  parameters: z.record(z.string(), z.any()).optional(),
  timeout: z.number().min(1000).max(30000).default(10000),
  limit: z.number().min(1).max(1000).default(100)
});

/**
 * @swagger
 * /api/v1/graphs:
 *   post:
 *     summary: Create a new graph
 *     tags: [Graphs]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: object
 *               relationships:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Graph created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/', 
  authenticateApiKey,
  graphOperationRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const validatedData = createGraphSchema.parse(req.body);
      
      // Store graph data in Walrus
      const walrusResult = await walrusService.storeGraph(
        validatedData.nodes,
        validatedData.relationships,
        { 
          name: validatedData.name, 
          description: validatedData.description 
        }
      );

      // Create graph metadata
      const graphMetadata = {
        name: validatedData.name,
        description: validatedData.description,
        blobId: walrusResult.blobId,
        nodeCount: validatedData.nodes.length,
        relationshipCount: validatedData.relationships.length,
        isPublic: validatedData.isPublic,
        tags: validatedData.tags,
        metadata: validatedData.metadata
      };

      // Create graph metadata on SUI blockchain - NO FALLBACK MODE
      console.log('🔗 SUI API: Attempting real blockchain transaction...');
      console.log('🔗 SUI API: Graph metadata:', JSON.stringify(graphMetadata, null, 2));
      
      const signAndExecute = createSignAndExecute(suiKeypair);
      const blockchainId = await suiGraphService.createGraphMetadata(graphMetadata, signAndExecute);
      console.log('✅ Graph registered on real SUI blockchain with ID:', blockchainId);

      res.status(201).json({
        success: true,
        data: {
          graphId: blockchainId,
          blobId: walrusResult.blobId,
          nodeCount: validatedData.nodes.length,
          relationshipCount: validatedData.relationships.length,
          metadata: graphMetadata
        },
        message: 'Graph created successfully'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.issues
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create graph',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/graphs/{id}:
 *   get:
 *     summary: Get graph by ID
 *     tags: [Graphs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Graph data
 *       404:
 *         description: Graph not found
 */
router.get('/:id', 
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Get from SUI blockchain - NO FALLBACK MODE
      const graphMetadata = await suiGraphService.getGraphMetadata(id);

      if (!graphMetadata) {
        return res.status(404).json({
          success: false,
          error: 'Graph not found'
        });
      }

      // Get graph data from Walrus
      const graphData = await walrusService.readGraph(graphMetadata.blobId);

      res.json({
        success: true,
        data: {
          ...graphMetadata,
          nodes: graphData.nodes,
          relationships: graphData.relationships
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve graph',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/graphs/{id}/query:
 *   post:
 *     summary: Execute graph query
 *     tags: [Graphs]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               parameters:
 *                 type: object
 *               timeout:
 *                 type: number
 *               limit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Query results
 *       400:
 *         description: Invalid query
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/:id/query',
  authenticateApiKey,
  queryRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedQuery = querySchema.parse(req.body);

      // Get graph data from SUI blockchain - NO FALLBACK MODE
      const graphMetadata = await suiGraphService.getGraphMetadata(id);
      if (!graphMetadata) {
        return res.status(404).json({
          success: false,
          error: 'Graph not found'
        });
      }

      const graphData = await walrusService.readGraph(graphMetadata.blobId);

      // Execute query (simplified for demo)
      const results = await executeGraphQuery(
        validatedQuery.query,
        graphData.nodes,
        graphData.relationships,
        validatedQuery.parameters,
        validatedQuery.limit
      );

      res.json({
        success: true,
        data: {
          query: validatedQuery.query,
          results,
          executionTime: Date.now(),
          totalResults: results.length
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query format',
          details: error.issues
        });
      }

      res.status(500).json({
        success: false,
        error: 'Query execution failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/graphs/{id}/analytics:
 *   get:
 *     summary: Get graph analytics
 *     tags: [Graphs]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/:id/analytics',
  authenticateApiKey,
  apiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Get graph metadata from SUI blockchain - NO FALLBACK MODE
      const graphMetadata = await suiGraphService.getGraphMetadata(id);
      if (!graphMetadata) {
        return res.status(404).json({
          success: false,
          error: 'Graph not found'
        });
      }

      const graphData = await walrusService.readGraph(graphMetadata.blobId);
      
      // Calculate analytics
      const analytics = calculateGraphAnalytics(graphData.nodes, graphData.relationships);

      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to calculate analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Helper functions

async function executeGraphQuery(
  query: string,
  nodes: any[],
  relationships: any[],
  parameters: any = {},
  limit: number = 100
): Promise<any[]> {
  // Simplified query execution
  // In production, this would use a proper graph query engine
  
  if (query.toLowerCase().includes('match') && query.toLowerCase().includes('person')) {
    return nodes
      .filter(node => node.type === 'Person')
      .slice(0, limit);
  }
  
  if (query.toLowerCase().includes('match') && query.toLowerCase().includes('company')) {
    return nodes
      .filter(node => node.type === 'Company')
      .slice(0, limit);
  }
  
  return nodes.slice(0, limit);
}

function calculateGraphAnalytics(nodes: any[], relationships: any[]) {
  const nodeTypes = [...new Set(nodes.map(n => n.type))];
  const relationshipTypes = [...new Set(relationships.map(r => r.type))];
  
  // Calculate centrality (simplified)
  const centrality = nodes.map(node => ({
    nodeId: node.id,
    degree: relationships.filter(r => r.sourceId === node.id || r.targetId === node.id).length
  }));

  return {
    nodeCount: nodes.length,
    relationshipCount: relationships.length,
    nodeTypes,
    relationshipTypes,
    averageDegree: centrality.reduce((sum, c) => sum + c.degree, 0) / nodes.length,
    density: relationships.length / (nodes.length * (nodes.length - 1)),
    centrality: centrality.sort((a, b) => b.degree - a.degree).slice(0, 10)
  };
}

export default router; 
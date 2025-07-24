import { Router, Request, Response, NextFunction } from 'express';
import { SuiGraphService } from '../services/sui-service';
import { WalrusService } from '../services/walrus-service';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const router = Router();

const suiGraphService = new SuiGraphService();
const walrusService = new WalrusService();

const SAVED_GRAPHS_FILE = path.join(__dirname, '../saved-graphs.json');

function loadSavedGraphsFromFile() {
  try {
    if (fs.existsSync(SAVED_GRAPHS_FILE)) {
      const data = fs.readFileSync(SAVED_GRAPHS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  return [];
}
function saveSavedGraphsToFile(graphs: any) {
  try {
    fs.writeFileSync(SAVED_GRAPHS_FILE, JSON.stringify(graphs, null, 2));
  } catch {}
}

const savedGraphs: Array<{
  userId: string;
  name: string;
  description: string;
  blobId: string;
  graphId: string;
  tags?: string[];
  timestamp: number;
}> = loadSavedGraphsFromFile();

const graphSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  nodeCount: z.number().int().nonnegative(),
  relationshipCount: z.number().int().nonnegative(),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  nodes: z.array(z.any()), // Placeholder for nodes
  relationships: z.array(z.any()) // Placeholder for relationships
});

const API_KEY = 'supersecretkey123'; // In production, use env vars

function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header('x-api-key');
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  next();
}

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

router.get('/health', function(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'ok' });
});

router.get('/api/graphs', async (req: Request, res: Response) => {
  try {
    const graphIds = await suiGraphService.getPublicGraphs();
    res.json({ graphIds });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/graphs/{id}:
 *   get:
 *     summary: Get a graph by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The graph ID
 *     responses:
 *       200:
 *         description: Graph object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 blobId:
 *                   type: string
 *                 nodeCount:
 *                   type: integer
 *                 relationshipCount:
 *                   type: integer
 *                 isPublic:
 *                   type: boolean
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: integer
 *                 updatedAt:
 *                   type: integer
 *                 owner:
 *                   type: string
 *                 version:
 *                   type: integer
 *       404:
 *         description: Graph not found
 */
router.get('/api/graphs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Mock response for now
    res.json({
      id,
      name: 'Mock Graph',
      description: 'This is a mock graph object.',
      blobId: 'mock-blob-id',
      nodeCount: 5,
      relationshipCount: 2,
      isPublic: true,
      tags: ['mock', 'test'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      owner: 'mock-owner',
      version: 1
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/graphs/{id}:
 *   put:
 *     summary: Update a graph by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The graph ID
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
 *               blobId:
 *                 type: string
 *               nodeCount:
 *                 type: integer
 *               relationshipCount:
 *                 type: integer
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: "Updated Graph"
 *             description: "Updated description"
 *             blobId: "blob456"
 *             nodeCount: 10
 *             relationshipCount: 4
 *             isPublic: false
 *             tags: ["updated", "api"]
 *     responses:
 *       200:
 *         description: Graph updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a graph by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The graph ID
 *     responses:
 *       200:
 *         description: Graph deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.put('/api/graphs/:id', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, name, description, tags } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const graph = savedGraphs.find(g => g.graphId === id && g.userId === userId);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }
    if (name) graph.name = name;
    if (description) graph.description = description;
    if (tags) graph.tags = tags;
    graph.timestamp = Date.now();
    saveSavedGraphsToFile(savedGraphs);
    res.json({ id, message: 'Graph updated', updated: graph });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/api/graphs/:id', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = savedGraphs.findIndex(g => g.graphId === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Graph not found' });
    }
    const deleted = savedGraphs.splice(index, 1)[0];
    saveSavedGraphsToFile(savedGraphs);
    res.json({ id, message: 'Graph deleted', deleted });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/graphs:
 *   post:
 *     summary: Create a new graph
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
 *               blobId:
 *                 type: string
 *               nodeCount:
 *                 type: integer
 *               relationshipCount:
 *                 type: integer
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
 *           example:
 *             name: "Test Graph"
 *             description: "A test graph"
 *             blobId: "blob123"
 *             nodeCount: 5
 *             relationshipCount: 2
 *             isPublic: true
 *             tags: ["test", "api"]
 *             nodes: [{"id": "node1", "type": "Person"}, {"id": "node2", "type": "Company"}]
 *             relationships: [{"source": "node1", "target": "node2", "type": "WORKS_FOR"}]
 *     responses:
 *       201:
 *         description: Graph created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 graphId:
 *                   type: string
 *                 blobId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/api/graphs', requireApiKey, async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = graphSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input', details: parseResult.error.issues });
    }
    const { userId, name, description, nodeCount, relationshipCount, isPublic, tags, nodes, relationships } = parseResult.data;

    // Store graph data in Walrus
    if (!nodes || !relationships) {
      return res.status(400).json({ error: 'Missing nodes or relationships for Walrus storage.' });
    }
    const walrusResult = await walrusService.storeGraph(nodes, relationships, { name, description });
    const blobId = walrusResult.blobId;

    // For now, require signAndExecute in the request (to be replaced with wallet or backend signing)
    let signAndExecute = req.body.signAndExecute;
    if (!signAndExecute) {
      // Mock signAndExecute for testing
      signAndExecute = async () => ({
        effects: { status: { status: 'success' } },
        objectChanges: [
          { type: 'created', objectType: 'GraphMetadata', objectId: 'mock-graph-id-' + Date.now(), version: 1 }
        ]
      });
    }

    // Register graph metadata on Sui
    const graphId = await suiGraphService.createGraphMetadata({
      name,
      description,
      blobId,
      nodeCount,
      relationshipCount,
      isPublic,
      tags,
    }, signAndExecute);

    // Store metadata in memory
    savedGraphs.push({
      userId,
      name,
      description,
      blobId,
      graphId,
      timestamp: Date.now()
    });
    saveSavedGraphsToFile(savedGraphs);

    res.status(201).json({ graphId, blobId });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// List all saved graphs for the current user
router.get('/api/graphs', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  res.json(savedGraphs.filter(g => g.userId === userId));
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Example users route
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.json({ users: [] });
});

export default router;

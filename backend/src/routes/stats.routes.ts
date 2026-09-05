import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', StatsController.getStats);

export default router;

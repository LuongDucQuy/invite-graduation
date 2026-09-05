import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

// Admin endpoints for message viewing & moderation
router.use(authenticateAdmin);

router.get('/event/:eventId', MessageController.getMessagesByEvent);
router.delete('/:id', MessageController.deleteMessage);

export default router;

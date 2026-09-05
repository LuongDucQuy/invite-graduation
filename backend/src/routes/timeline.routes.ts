import { Router } from 'express';
import { TimelineController } from '../controllers/timeline.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const timelineSchema = z.object({
  body: z.object({
    eventId: z.string().min(1, 'Event ID is required'),
    time: z.string().min(1, 'Time is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

// Public endpoint for timeline by event
router.get('/event/:eventId', TimelineController.getTimelinesByEvent);

// Admin endpoints
router.post('/', authenticateAdmin, validateRequest(timelineSchema), TimelineController.createTimeline);
router.put('/:id', authenticateAdmin, TimelineController.updateTimeline);
router.delete('/:id', authenticateAdmin, TimelineController.deleteTimeline);

export default router;

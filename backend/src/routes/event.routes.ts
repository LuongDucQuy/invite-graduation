import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const eventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    graduateName: z.string().min(1, 'Graduate name is required'),
    graduateMessage: z.string().optional(),
    description: z.string().optional(),
    eventDate: z.string().min(1, 'Event date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().optional(),
    venueName: z.string().min(1, 'Venue name is required'),
    venueAddress: z.string().min(1, 'Venue address is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    googleMapUrl: z.string().optional(),
    coverImage: z.string().optional(),
    avatarImage: z.string().optional(),
    backgroundMusic: z.string().optional(),
    dressCode: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

// Public primary event route (for preview/fallback)
router.get('/primary', EventController.getPrimaryEvent);

// Admin protected event routes
router.get('/', authenticateAdmin, EventController.getAllEvents);
router.get('/:id', authenticateAdmin, EventController.getEventById);
router.post('/', authenticateAdmin, validateRequest(eventSchema), EventController.createEvent);
router.put('/:id', authenticateAdmin, EventController.updateEvent);
router.delete('/:id', authenticateAdmin, EventController.deleteEvent);

export default router;

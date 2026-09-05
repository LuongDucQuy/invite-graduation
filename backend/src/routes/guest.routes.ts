import { Router } from 'express';
import { GuestController } from '../controllers/guest.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const createGuestSchema = z.object({
  body: z.object({
    eventId: z.string().min(1, 'Event ID is required'),
    name: z.string().min(1, 'Guest name is required'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    numberOfGuests: z.number().int().min(1).default(1),
    relationship: z.string().optional(),
  }),
});

const updateGuestSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    numberOfGuests: z.number().int().min(1).optional(),
    relationship: z.string().optional(),
    rsvpStatus: z.enum(['PENDING', 'ATTENDING', 'NOT_ATTENDING']).optional(),
    rsvpMessage: z.string().optional(),
  }),
});

// Admin protected guest routes
router.use(authenticateAdmin);

router.get('/', GuestController.getGuests);
router.post('/import', GuestController.importGuests);
router.get('/:id', GuestController.getGuestById);
router.post('/', validateRequest(createGuestSchema), GuestController.createGuest);
router.put('/:id', validateRequest(updateGuestSchema), GuestController.updateGuest);
router.delete('/:id', GuestController.deleteGuest);

export default router;

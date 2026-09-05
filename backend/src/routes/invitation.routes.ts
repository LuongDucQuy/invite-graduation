import { Router } from 'express';
import { InvitationController } from '../controllers/invitation.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const rsvpSchema = z.object({
  body: z.object({
    rsvpStatus: z.enum(['ATTENDING', 'NOT_ATTENDING', 'PENDING']),
    numberOfGuests: z.number().int().min(1).optional(),
    rsvpMessage: z.string().optional(),
    guestName: z.string().optional(),
  }),
});

const messageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required').max(1000),
    guestName: z.string().optional(),
  }),
});

// Public endpoints accessed by invite tokens
router.get('/:token', InvitationController.getInvitationByToken);
router.post('/:token/rsvp', validateRequest(rsvpSchema), InvitationController.submitRsvp);
router.get('/:token/messages', InvitationController.getInvitationMessages);
router.post('/:token/messages', validateRequest(messageSchema), InvitationController.postInvitationMessage);

export default router;

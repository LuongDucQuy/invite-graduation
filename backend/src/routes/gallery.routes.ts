import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const gallerySchema = z.object({
  body: z.object({
    eventId: z.string().min(1, 'Event ID is required'),
    imageUrl: z.string().min(1, 'Image URL is required'),
    caption: z.string().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

// Public endpoint for gallery by event
router.get('/event/:eventId', GalleryController.getGalleryByEvent);

// Admin endpoints
router.post('/', authenticateAdmin, validateRequest(gallerySchema), GalleryController.createGallery);
router.put('/:id', authenticateAdmin, GalleryController.updateGallery);
router.delete('/:id', authenticateAdmin, GalleryController.deleteGallery);

export default router;

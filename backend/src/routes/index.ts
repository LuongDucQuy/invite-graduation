import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import guestRoutes from './guest.routes';
import invitationRoutes from './invitation.routes';
import timelineRoutes from './timeline.routes';
import galleryRoutes from './gallery.routes';
import messageRoutes from './message.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/guests', guestRoutes);
router.use('/invitations', invitationRoutes);
router.use('/timeline', timelineRoutes);
router.use('/gallery', galleryRoutes);
router.use('/messages', messageRoutes);
router.use('/stats', statsRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

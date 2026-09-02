import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/notifications
router.get('/', authenticate, notificationController.getNotifications);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', authenticate, notificationController.markAsRead);

// PATCH /api/v1/notifications/read-all
router.patch('/read-all', authenticate, notificationController.markAllAsRead);

export default router;

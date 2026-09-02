import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, changePasswordSchema } from '../utils/validation';

const router = Router();

// GET /api/v1/users/me
router.get('/me', authenticate, userController.getProfile);

// PATCH /api/v1/users/me
router.patch('/me', authenticate, userController.updateProfile);

// POST /api/v1/users/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

// PATCH /api/v1/users/notifications
router.patch('/notifications', authenticate, userController.updateNotificationSettings);

export default router;

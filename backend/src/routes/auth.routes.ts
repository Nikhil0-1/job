import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// GET /api/v1/auth/me
router.get('/me', authenticate, authController.getMe);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, authController.logout);

export default router;

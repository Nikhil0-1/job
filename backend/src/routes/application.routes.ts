import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import { authenticate, requireEmployer } from '../middleware/auth.middleware';
import { validate, applicationStatusSchema } from '../utils/validation';

const router = Router();

// Employer: get all applications for their jobs
// GET /api/v1/applications
router.get('/', authenticate, requireEmployer, applicationController.getEmployerApplications);

// Get specific application
// GET /api/v1/applications/:id
router.get('/:id', authenticate, applicationController.getApplicationById);

// Job seeker: create application (called from Android app)
// POST /api/v1/applications
router.post('/', authenticate, applicationController.createApplication);

// Employer: update application status
// PATCH /api/v1/applications/:id/status
router.patch('/:id/status', authenticate, requireEmployer, validate(applicationStatusSchema), applicationController.updateApplicationStatus);

export default router;

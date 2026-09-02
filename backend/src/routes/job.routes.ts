import { Router } from 'express';
import * as jobController from '../controllers/job.controller';
import { authenticate, requireEmployer } from '../middleware/auth.middleware';
import { validate, jobSchema } from '../utils/validation';

const router = Router();

// Public routes
// GET /api/v1/jobs
router.get('/', jobController.getPublicJobs);

// GET /api/v1/jobs/:id
router.get('/:id', jobController.getJobById);

// Protected employer routes
// GET /api/v1/jobs/employer/my-jobs
router.get('/employer/my-jobs', authenticate, requireEmployer, jobController.getEmployerJobs);

// POST /api/v1/jobs
router.post('/', authenticate, requireEmployer, validate(jobSchema), jobController.createJob);

// PATCH /api/v1/jobs/:id
router.patch('/:id', authenticate, requireEmployer, jobController.updateJob);

// DELETE /api/v1/jobs/:id
router.delete('/:id', authenticate, requireEmployer, jobController.deleteJob);

// PATCH /api/v1/jobs/:id/status
router.patch('/:id/status', authenticate, requireEmployer, jobController.updateJobStatus);

// GET /api/v1/jobs/:id/applications
router.get('/:id/applications', authenticate, requireEmployer, jobController.getJobApplications);

export default router;

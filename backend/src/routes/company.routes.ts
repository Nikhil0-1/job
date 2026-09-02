import { Router } from 'express';
import * as companyController from '../controllers/company.controller';
import { authenticate, requireEmployer } from '../middleware/auth.middleware';
import { validate, companySchema } from '../utils/validation';
import { logoUpload } from '../utils/upload';

const router = Router();

// GET /api/v1/companies/:id (public)
router.get('/:id', companyController.getCompanyById);

// GET /api/v1/companies/employer/profile (employer's own company)
router.get('/employer/profile', authenticate, requireEmployer, companyController.getMyCompany);

// POST /api/v1/companies (create or update company profile)
router.post('/', authenticate, requireEmployer, validate(companySchema), companyController.createOrUpdateCompany);

// PATCH /api/v1/companies/:id (update)
router.patch('/:id', authenticate, requireEmployer, validate(companySchema), companyController.updateCompany);

// POST /api/v1/companies/:id/logo (upload logo)
router.post(
  '/:id/logo',
  authenticate,
  requireEmployer,
  (req, _res, next) => { (req as any).uploadType = 'logos'; next(); },
  logoUpload.single('logo'),
  companyController.uploadLogo
);

export default router;

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/v1/companies/:id (public)
export const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { category: { select: { name: true } } },
      },
    },
  });

  if (!company) throw createError('Company not found', 404);

  res.json({ success: true, data: { company }, message: 'Company fetched successfully' });
});

// GET /api/v1/companies/employer/profile (protected)
export const getMyCompany = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employerProfileId = req.user?.employerProfileId;
  if (!employerProfileId) throw createError('Employer profile not found', 404);

  const company = await prisma.company.findUnique({
    where: { employerProfileId },
  });

  res.json({ success: true, data: { company: company || null }, message: 'Company profile fetched' });
});

// POST /api/v1/companies (create or update)
export const createOrUpdateCompany = asyncHandler(async (req: AuthRequest, res: Response) => {
  const employerProfileId = req.user?.employerProfileId;
  if (!employerProfileId) throw createError('Employer profile not found', 400);

  const existing = await prisma.company.findUnique({ where: { employerProfileId } });

  let company;
  if (existing) {
    company = await prisma.company.update({
      where: { employerProfileId },
      data: req.body,
    });
  } else {
    company = await prisma.company.create({
      data: { ...req.body, employerProfileId },
    });
  }

  // Mark employer profile as complete
  await prisma.employerProfile.update({
    where: { id: employerProfileId },
    data: { isProfileComplete: true },
  });

  res.json({ success: true, data: { company }, message: 'Company profile saved successfully' });
});

// PATCH /api/v1/companies/:id
export const updateCompany = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const employerProfileId = req.user?.employerProfileId;

  const company = await prisma.company.findFirst({ where: { id, employerProfileId } });
  if (!company) throw createError('Company not found or access denied', 404);

  const updated = await prisma.company.update({
    where: { id },
    data: req.body,
  });

  res.json({ success: true, data: { company: updated }, message: 'Company updated successfully' });
});

// POST /api/v1/companies/:id/logo
export const uploadLogo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const employerProfileId = req.user?.employerProfileId;

  const company = await prisma.company.findFirst({ where: { id, employerProfileId } });
  if (!company) throw createError('Company not found or access denied', 404);

  if (!req.file) throw createError('No file uploaded', 400);

  const logoUrl = `${process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/logos/${req.file.filename}`;

  const updated = await prisma.company.update({
    where: { id },
    data: { logo: logoUrl },
  });

  res.json({ success: true, data: { company: updated, logoUrl }, message: 'Logo uploaded successfully' });
});

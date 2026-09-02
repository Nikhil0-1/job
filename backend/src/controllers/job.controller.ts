import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/v1/jobs (public)
export const getPublicJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    search,
    category,
    jobType,
    workMode,
    experience,
    city,
    state,
    country,
    minSalary,
    maxSalary,
    sortBy = 'createdAt',
    order = 'desc',
    page = '1',
    limit = '12',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {
    status: 'ACTIVE',
    ...(search && {
      OR: [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { company: { name: { contains: search as string, mode: 'insensitive' } } },
      ],
    }),
    ...(category && { category: { slug: category as string } }),
    ...(jobType && { jobType: jobType as any }),
    ...(workMode && { workMode: workMode as any }),
    ...(experience && { experience: experience as any }),
    ...(city && { city: { contains: city as string, mode: 'insensitive' } }),
    ...(state && { state: { contains: state as string, mode: 'insensitive' } }),
    ...(country && { country: { contains: country as string, mode: 'insensitive' } }),
    ...(minSalary && { maxSalary: { gte: parseFloat(minSalary as string) } }),
    ...(maxSalary && { minSalary: { lte: parseFloat(maxSalary as string) } }),
  };

  const orderBy: any = {};
  if (sortBy === 'salary') orderBy.maxSalary = order;
  else if (sortBy === 'title') orderBy.title = order;
  else orderBy.createdAt = order;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        company: { select: { id: true, name: true, logo: true, city: true, country: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: pageNum < Math.ceil(total / limitNum),
      },
    },
    message: 'Jobs fetched successfully',
  });
});

// GET /api/v1/jobs/:id (public)
export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      category: true,
      _count: { select: { applications: true } },
    },
  });

  if (!job) throw createError('Job not found', 404);

  // Increment view count
  await prisma.job.update({ where: { id }, data: { views: { increment: 1 } } });

  // Get related jobs
  const relatedJobs = await prisma.job.findMany({
    where: {
      status: 'ACTIVE',
      id: { not: id },
      OR: [
        { categoryId: job.categoryId || undefined },
        { companyId: job.companyId },
      ],
    },
    take: 4,
    include: {
      company: { select: { id: true, name: true, logo: true } },
      category: { select: { name: true } },
    },
  });

  res.json({
    success: true,
    data: { job: { ...job, views: job.views + 1 }, relatedJobs },
    message: 'Job fetched successfully',
  });
});

// GET /api/v1/jobs/employer/my-jobs (protected)
export const getEmployerJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  if (!companyId) throw createError('Company profile not found. Please complete your company profile.', 400);

  const { status, search, page = '1', limit = '10' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {
    companyId,
    ...(status && { status: status as any }),
    ...(search && { title: { contains: search as string, mode: 'insensitive' } }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        category: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    },
    message: 'Jobs fetched successfully',
  });
});

// POST /api/v1/jobs (protected)
export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  if (!companyId) throw createError('Please complete your company profile before posting jobs', 400);

  const { deadline, skills, ...rest } = req.body;

  const job = await prisma.job.create({
    data: {
      ...rest,
      companyId,
      skills: skills || [],
      deadline: deadline ? new Date(deadline) : null,
      status: 'ACTIVE',
    },
    include: {
      company: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  res.status(201).json({
    success: true,
    data: { job },
    message: 'Job published successfully',
  });
});

// PATCH /api/v1/jobs/:id (protected)
export const updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const companyId = req.user?.companyId;

  // Ownership check
  const existingJob = await prisma.job.findFirst({ where: { id, companyId } });
  if (!existingJob) throw createError('Job not found or access denied', 404);

  const { deadline, skills, ...rest } = req.body;

  const job = await prisma.job.update({
    where: { id },
    data: {
      ...rest,
      ...(skills !== undefined && { skills }),
      ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
    },
    include: {
      company: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  res.json({ success: true, data: { job }, message: 'Job updated successfully' });
});

// DELETE /api/v1/jobs/:id (protected)
export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const companyId = req.user?.companyId;

  const existingJob = await prisma.job.findFirst({ where: { id, companyId } });
  if (!existingJob) throw createError('Job not found or access denied', 404);

  await prisma.job.delete({ where: { id } });

  res.json({ success: true, data: null, message: 'Job deleted successfully' });
});

// PATCH /api/v1/jobs/:id/status (protected)
export const updateJobStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const companyId = req.user?.companyId;

  if (!['ACTIVE', 'CLOSED', 'DRAFT'].includes(status)) {
    throw createError('Invalid status', 400);
  }

  const existingJob = await prisma.job.findFirst({ where: { id, companyId } });
  if (!existingJob) throw createError('Job not found or access denied', 404);

  const job = await prisma.job.update({ where: { id }, data: { status } });

  res.json({ success: true, data: { job }, message: `Job ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully` });
});

// GET /api/v1/jobs/:id/applications (protected)
export const getJobApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const companyId = req.user?.companyId;

  const job = await prisma.job.findFirst({ where: { id, companyId } });
  if (!job) throw createError('Job not found or access denied', 404);

  const applications = await prisma.application.findMany({
    where: { jobId: id },
    orderBy: { appliedAt: 'desc' },
    include: {
      jobSeekerProfile: true,
    },
  });

  res.json({ success: true, data: { applications }, message: 'Applications fetched successfully' });
});

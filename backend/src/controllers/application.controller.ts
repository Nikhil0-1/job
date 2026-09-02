import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/v1/applications (employer: their jobs' applications)
export const getEmployerApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const companyId = req.user?.companyId;
  if (!companyId) throw createError('Company profile not found', 400);

  const { search, jobId, status, page = '1', limit = '10' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {
    job: { companyId },
    ...(jobId && { jobId: jobId as string }),
    ...(status && { status: status as any }),
    ...(search && {
      OR: [
        { jobSeekerProfile: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { jobSeekerProfile: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ],
    }),
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { appliedAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        job: { select: { id: true, title: true } },
        jobSeekerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            headline: true,
            skills: true,
            location: true,
            avatar: true,
            resume: true,
          },
        },
      },
    }),
    prisma.application.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      applications,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    },
    message: 'Applications fetched successfully',
  });
});

// GET /api/v1/applications/:id
export const getApplicationById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;
  const companyId = req.user?.companyId;

  const application: any = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        include: { company: { select: { id: true, name: true, logo: true } } },
      },
      jobSeekerProfile: true,
      statusHistory: { orderBy: { changedAt: 'desc' } },
    },
  });

  if (!application) throw createError('Application not found', 404);

  // Authorization: employer can view if job belongs to their company; job seeker can view their own
  const isEmployer = companyId && application.job?.company?.id === companyId;
  const isJobSeeker = application.jobSeekerProfile?.userId === userId;

  if (!isEmployer && !isJobSeeker) {
    throw createError('Access denied', 403);
  }

  res.json({ success: true, data: { application }, message: 'Application fetched successfully' });
});

// POST /api/v1/applications (job seeker: from Android app)
export const createApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId, coverLetter, resumeUrl } = req.body;
  const userId = req.user?.id;

  const seekerProfile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!seekerProfile) throw createError('Job seeker profile not found', 404);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== 'ACTIVE') throw createError('Job not found or no longer active', 404);

  // Check duplicate application
  const existing = await prisma.application.findUnique({
    where: { jobId_jobSeekerProfileId: { jobId, jobSeekerProfileId: seekerProfile.id } },
  });
  if (existing) throw createError('You have already applied for this job', 409);

  const application = await prisma.application.create({
    data: {
      jobId,
      jobSeekerProfileId: seekerProfile.id,
      coverLetter,
      resumeUrl,
      status: 'APPLIED',
      statusHistory: {
        create: { status: 'APPLIED', note: 'Application submitted' },
      },
    },
    include: {
      job: { select: { title: true, company: { select: { name: true } } } },
    },
  });

  res.status(201).json({ success: true, data: { application }, message: 'Application submitted successfully' });
});

// PATCH /api/v1/applications/:id/status (employer)
export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { status, note } = req.body;
  const companyId = req.user?.companyId;

  const application: any = await prisma.application.findUnique({
    where: { id },
    include: { job: { select: { companyId: true, title: true } } },
  });

  if (!application) throw createError('Application not found', 404);
  if (application.job?.companyId !== companyId) throw createError('Access denied', 403);

  const updated: any = await prisma.application.update({
    where: { id },
    data: {
      status,
      statusHistory: {
        create: { status, note: note || null },
      },
    },
    include: {
      jobSeekerProfile: { select: { firstName: true, lastName: true } },
      job: { select: { title: true } },
      statusHistory: { orderBy: { changedAt: 'desc' } },
    },
  });

  // Create notification for job seeker
  await prisma.notification.create({
    data: {
      userId: updated.jobSeekerProfile ? (await prisma.jobSeekerProfile.findUnique({
        where: { id: updated.jobSeekerProfileId },
        select: { userId: true },
      }))!.userId : '',
      title: `Application Status Updated`,
      message: `Your application for ${updated.job?.title || 'Job'} has been updated to: ${status.replace('_', ' ')}`,
      type: 'APPLICATION_UPDATE',
    },
  }).catch(() => {}); // non-blocking

  const statusMessages: Record<string, string> = {
    UNDER_REVIEW: 'Application marked as under review',
    SHORTLISTED: 'Candidate shortlisted',
    SELECTED: 'Candidate selected',
    REJECTED: 'Application rejected',
  };

  res.json({
    success: true,
    data: { application: updated },
    message: statusMessages[status] || 'Status updated successfully',
  });
});

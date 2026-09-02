import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/error.middleware';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.jobCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { jobs: { where: { status: 'ACTIVE' } } } } },
  });

  res.json({ success: true, data: { categories }, message: 'Categories fetched successfully' });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const category = await prisma.jobCategory.findUnique({
    where: { slug },
    include: { _count: { select: { jobs: { where: { status: 'ACTIVE' } } } } },
  });

  if (!category) {
    return res.status(404).json({ success: false, data: null, message: 'Category not found' });
  }

  res.json({ success: true, data: { category }, message: 'Category fetched' });
});

import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, email: true, role: true, createdAt: true,
      employerProfile: { include: { company: true } },
    },
  });

  if (!user) throw createError('User not found', 404);
  res.json({ success: true, data: { user }, message: 'Profile fetched' });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, phone } = req.body;
  const userId = req.user!.id;

  if (email && email !== req.user!.email) {
    const existing = await prisma.user.findFirst({ where: { email, id: { not: userId } } });
    if (existing) throw createError('Email already in use', 409);
    await prisma.user.update({ where: { id: userId }, data: { email } });
  }

  if (phone && req.user!.employerProfileId) {
    await prisma.employerProfile.update({
      where: { id: req.user!.employerProfileId },
      data: { phone },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, employerProfile: { include: { company: true } } },
  });

  res.json({ success: true, data: { user }, message: 'Profile updated successfully' });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw createError('User not found', 404);

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw createError('Current password is incorrect', 400);

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  res.json({ success: true, data: null, message: 'Password changed successfully' });
});

export const updateNotificationSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  // This can be extended to store notification preferences in the DB
  // For now, we acknowledge the update
  res.json({ success: true, data: req.body, message: 'Notification settings updated' });
});

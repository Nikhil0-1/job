import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user!.id, isRead: false },
  });

  res.json({ success: true, data: { notifications, unreadCount }, message: 'Notifications fetched' });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.notification.updateMany({
    where: { id, userId: req.user!.id },
    data: { isRead: true },
  });
  res.json({ success: true, data: null, message: 'Notification marked as read' });
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, isRead: false },
    data: { isRead: true },
  });
  res.json({ success: true, data: null, message: 'All notifications marked as read' });
});

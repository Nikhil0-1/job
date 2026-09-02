import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendEmail, getPasswordResetEmail } from '../utils/email';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { companyName, email, phone, password, industry, companyType } = req.body;

  // Check existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'EMPLOYER',
      employerProfile: {
        create: {
          companyName,
          phone: phone || null,
          industry: industry || null,
          companyType: companyType || null,
          isProfileComplete: false,
        },
      },
    },
    include: {
      employerProfile: true,
    },
  });

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employerProfileId: user.employerProfile?.id,
        companyName: user.employerProfile?.companyName,
        isProfileComplete: user.employerProfile?.isProfileComplete,
      },
    },
    message: 'Registration successful',
  });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      employerProfile: {
        include: { company: true },
      },
    },
  });

  if (!user || !user.isActive) {
    throw createError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employerProfileId: user.employerProfile?.id,
        companyId: user.employerProfile?.company?.id,
        companyName: user.employerProfile?.companyName || user.employerProfile?.company?.name,
        isProfileComplete: user.employerProfile?.isProfileComplete,
        hasCompany: !!user.employerProfile?.company,
      },
    },
    message: 'Login successful',
  });
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { employerProfile: true },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return res.json({
      success: true,
      data: null,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  }

  // Create reset token
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordReset.create({
    data: { userId: user.id, token, expiresAt },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/employer/reset-password?token=${token}`;
  const name = user.employerProfile?.companyName || email;
  const emailContent = getPasswordResetEmail(resetUrl, name);

  await sendEmail({ to: email, ...emailContent });

  res.json({
    success: true,
    data: null,
    message: 'If an account exists with this email, you will receive a password reset link.',
  });
});

// POST /api/v1/auth/reset-password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetRecord) throw createError('Invalid reset token', 400);
  if (resetRecord.usedAt) throw createError('Reset token has already been used', 400);
  if (resetRecord.expiresAt < new Date()) throw createError('Reset token has expired', 400);

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  res.json({
    success: true,
    data: null,
    message: 'Password reset successful. You can now login with your new password.',
  });
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      employerProfile: {
        include: { company: true },
      },
    },
  });

  if (!user) throw createError('User not found', 404);

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      employerProfileId: user.employerProfile?.id,
      companyId: user.employerProfile?.company?.id,
      companyName: user.employerProfile?.companyName || user.employerProfile?.company?.name,
      isProfileComplete: user.employerProfile?.isProfileComplete,
      hasCompany: !!user.employerProfile?.company,
    },
    message: 'Success',
  });
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  // JWT is stateless; client should discard the token
  // For enhanced security, you can maintain a token blacklist in Redis
  res.json({ success: true, data: null, message: 'Logged out successfully' });
});

import { z } from 'zod';

export const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  industry: z.string().optional(),
  companyType: z.string().optional(),
  location: z.string().optional(),
  agreeTerms: z.boolean().refine((v: boolean) => v === true, 'You must agree to the terms'),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data: any) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  categoryId: z.string().optional(),
  department: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE']),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  salaryPeriod: z.enum(['HOURLY', 'MONTHLY', 'YEARLY']).optional(),
  experience: z.enum(['FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
  vacancies: z.number().int().positive().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  deadline: z.string().optional(),
}).refine(
  (data: any) => {
    if (data.minSalary && data.maxSalary) {
      return data.maxSalary >= data.minSalary;
    }
    return true;
  },
  { message: 'Maximum salary must be greater than or equal to minimum salary', path: ['maxSalary'] }
);

export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  about: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED']),
  note: z.string().optional(),
});

export const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      data: null,
      message: result.error.issues[0]?.message || 'Validation failed',
      errors: result.error.issues,
    });
  }
  req.body = result.data;
  next();
};

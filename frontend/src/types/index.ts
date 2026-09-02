export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'REMOTE';
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type ExperienceLevel = 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
export type SalaryPeriod = 'HOURLY' | 'MONTHLY' | 'YEARLY';
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED';
export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED';
export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  about?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: { jobs: number };
}

export interface Job {
  id: string;
  companyId: string;
  categoryId?: string;
  title: string;
  department?: string;
  jobType: JobType;
  workMode: WorkMode;
  country?: string;
  state?: string;
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryPeriod?: SalaryPeriod;
  experience: ExperienceLevel;
  education?: string;
  skills: string[];
  vacancies?: number;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  deadline?: string;
  status: JobStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  category?: JobCategory;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerProfileId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  job?: Pick<Job, 'id' | 'title'>;
  jobSeekerProfile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    headline?: string;
    skills: string[];
    location?: string;
    avatar?: string;
    resume?: string;
    about?: string;
    phone?: string;
    education?: string;
  };
  statusHistory?: ApplicationStatusHistory[];
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  note?: string;
  changedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employerProfileId?: string;
  companyId?: string;
  companyName?: string;
  isProfileComplete?: boolean;
  hasCompany?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  REMOTE: 'Remote',
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  FRESHER: 'Fresher',
  JUNIOR: 'Junior (1-3 yrs)',
  MID: 'Mid (3-5 yrs)',
  SENIOR: 'Senior (5-8 yrs)',
  LEAD: 'Lead (8+ yrs)',
  EXECUTIVE: 'Executive',
};

export const SALARY_PERIOD_LABELS: Record<SalaryPeriod, string> = {
  HOURLY: '/hour',
  MONTHLY: '/month',
  YEARLY: '/year',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
};

export const formatSalary = (min?: number, max?: number, period?: SalaryPeriod): string => {
  if (!min && !max) return 'Salary not disclosed';
  const format = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  const suffix = period ? SALARY_PERIOD_LABELS[period] : '/year';
  if (min && max) return `${format(min)} – ${format(max)}${suffix}`;
  if (min) return `${format(min)}+${suffix}`;
  return `Up to ${format(max!)}${suffix}`;
};

export const getTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

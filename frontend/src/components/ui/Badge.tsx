'use client';

import { ApplicationStatus, APPLICATION_STATUS_LABELS } from '@/types';

const statusStyles: Record<ApplicationStatus, { bg: string; color: string }> = {
  APPLIED: { bg: '#DBEAFE', color: '#2563EB' },
  UNDER_REVIEW: { bg: '#FEF3C7', color: '#D97706' },
  SHORTLISTED: { bg: '#EDE9FE', color: '#7C3AED' },
  SELECTED: { bg: '#D1FAE5', color: '#059669' },
  REJECTED: { bg: '#FEE2E2', color: '#DC2626' },
};

const jobStatusStyles: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: '#D1FAE5', color: '#059669' },
  DRAFT: { bg: '#FEF3C7', color: '#D97706' },
  CLOSED: { bg: '#FEE2E2', color: '#DC2626' },
  EXPIRED: { bg: '#F1F5F9', color: '#64748B' },
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const style = statusStyles[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem',
      borderRadius: 100, fontSize: '0.8125rem', fontWeight: 600,
      background: style.bg, color: style.color,
    }}>
      {APPLICATION_STATUS_LABELS[status] || status}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: string }) {
  const style = jobStatusStyles[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem',
      borderRadius: 100, fontSize: '0.8125rem', fontWeight: 600,
      background: style.bg, color: style.color,
    }}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function Badge({ children, variant = 'gray' }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className={`badge badge-${variant}`}>{children}</span>
  );
}

'use client';

import { Job, JOB_TYPE_LABELS, WORK_MODE_LABELS, formatSalary, getTimeAgo } from '@/types';
import { MapPin, Clock, DollarSign, Briefcase, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'compact' | 'featured';
}

export default function JobCard({ job, variant = 'default' }: JobCardProps) {
  const getJobTypeBadgeClass = (type: string) => {
    const map: Record<string, string> = {
      FULL_TIME: 'badge-blue',
      PART_TIME: 'badge-yellow',
      CONTRACT: 'badge-purple',
      INTERNSHIP: 'badge-orange',
      FREELANCE: 'badge-gray',
      REMOTE: 'badge-green',
    };
    return map[type] || 'badge-gray';
  };

  const getWorkModeBadgeClass = (mode: string) => {
    const map: Record<string, string> = { ONSITE: 'badge-gray', REMOTE: 'badge-green', HYBRID: 'badge-blue' };
    return map[mode] || 'badge-gray';
  };

  const initials = job.company?.name
    ? job.company.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'CO';

  return (
    <motion.div
      className="card card-hover"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Company Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: job.company?.logo ? 'transparent' : 'var(--primary-50)',
          border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {job.company?.logo ? (
            <Image src={job.company.logo} alt={job.company.name || ''} width={52} height={52} style={{ objectFit: 'cover' }} />
          ) : (
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{initials}</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
            <Link
              href={`/jobs/${job.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            >
              {job.title}
            </Link>
          </h3>
          {job.company && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {job.company.name}
            </p>
          )}
        </div>

        {/* Status */}
        {job.status === 'ACTIVE' && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', flexShrink: 0, marginTop: 6 }} />
        )}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
          {JOB_TYPE_LABELS[job.jobType]}
        </span>
        <span className={`badge ${getWorkModeBadgeClass(job.workMode)}`}>
          {WORK_MODE_LABELS[job.workMode]}
        </span>
        {job.category && (
          <span className="badge badge-gray">{job.category.name}</span>
        )}
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
        {(job.city || job.state) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <MapPin size={14} />
            <span>{[job.city, job.state].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {(job.minSalary || job.maxSalary) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <DollarSign size={14} />
            <span>{formatSalary(job.minSalary, job.maxSalary, job.salaryPeriod)}</span>
          </div>
        )}
        {job.vacancies && job.vacancies > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Users size={14} />
            <span>{job.vacancies} openings</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          <Clock size={13} />
          <span>{getTimeAgo(job.createdAt)}</span>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          View Job
        </Link>
      </div>
    </motion.div>
  );
}

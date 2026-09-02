'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, FileText, TrendingUp, Users, Plus, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { jobsAPI, applicationsAPI } from '@/lib/api';
import { Job, Application } from '@/types';
import { ApplicationStatusBadge, JobStatusBadge } from '@/components/ui/Badge';
import { DashboardStatSkeleton, EmptyState } from '@/components/ui/Skeletons';
import { getTimeAgo } from '@/types';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  shortlisted: number;
}

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{count}</>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobsAPI.getEmployerJobs({ limit: 5 }),
          applicationsAPI.getEmployerApplications({ limit: 5 }),
        ]);
        const jobData = jobsRes.data.data.jobs || [];
        const appData = appsRes.data.data.applications || [];
        setJobs(jobData);
        setApplications(appData);

        // Calculate stats
        const totalApps = appsRes.data.data.pagination?.total || 0;
        const totalJobs = jobsRes.data.data.pagination?.total || 0;
        setStats({
          totalJobs,
          activeJobs: jobData.filter((j: Job) => j.status === 'ACTIVE').length,
          totalApplications: totalApps,
          shortlisted: appData.filter((a: Application) => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length,
        });
      } catch {
        setStats({ totalJobs: 0, activeJobs: 0, totalApplications: 0, shortlisted: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: <Briefcase size={22} />, color: 'var(--primary)', bg: 'var(--primary-50)', href: '/employer/jobs' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: <TrendingUp size={22} />, color: '#059669', bg: '#D1FAE5', href: '/employer/jobs' },
    { label: 'Applications', value: stats?.totalApplications || 0, icon: <FileText size={22} />, color: '#7C3AED', bg: '#EDE9FE', href: '/employer/applications' },
    { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: <CheckCircle size={22} />, color: '#D97706', bg: '#FEF3C7', href: '/employer/applications' },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>
          Welcome back, {user?.companyName || 'Employer'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your hiring activity.</p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }} className="stats-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <DashboardStatSkeleton key={i} />)
        ) : (
          statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={card.href} style={{ textDecoration: 'none' }}>
                <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, background: card.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                      {card.icon}
                    </div>
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    <AnimatedCounter value={card.value} />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.375rem', fontWeight: 500 }}>
                    {card.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/employer/jobs/create" className="btn btn-primary">
            <Plus size={18} />
            Post New Job
          </Link>
          <Link href="/employer/jobs" className="btn btn-secondary">
            <Briefcase size={18} />
            Manage Jobs
          </Link>
          <Link href="/employer/applications" className="btn btn-secondary">
            <FileText size={18} />
            View Applications
          </Link>
          <Link href="/employer/company-profile" className="btn btn-ghost" style={{ border: '1.5px solid var(--border)' }}>
            Edit Company Profile
          </Link>
        </div>
      </motion.div>

      {/* Recent Jobs & Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="dashboard-grid">
        {/* Recent Jobs */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem' }}>Recent Jobs</h2>
            <Link href="/employer/jobs" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '1.5rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div className="skeleton" style={{ height: 16, flex: 1 }} />
                    <div className="skeleton" style={{ height: 16, width: 80 }} />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase size={24} />}
                title="No jobs posted yet"
                description="Post your first job to start receiving applications."
                action={<Link href="/employer/jobs/create" className="btn btn-primary btn-sm">Post a Job</Link>}
              />
            ) : (
              <div>
                {jobs.map((job, i) => (
                  <Link key={job.id} href={`/employer/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderBottom: i < jobs.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem', display: 'flex', gap: '0.75rem' }}>
                          <span>{job._count?.applications || 0} applications</span>
                          <span>·</span>
                          <span>{getTimeAgo(job.createdAt)}</span>
                        </div>
                      </div>
                      <JobStatusBadge status={job.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem' }}>Recent Applications</h2>
            <Link href="/employer/applications" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '1.5rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 16, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 14, width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={<FileText size={24} />}
                title="No applications yet"
                description="Applications from candidates will appear here."
              />
            ) : (
              <div>
                {applications.map((app, i) => (
                  <Link key={app.id} href={`/employer/applications/${app.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderBottom: i < applications.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--primary-50)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)', flexShrink: 0,
                      }}>
                        {[app.jobSeekerProfile?.firstName?.[0], app.jobSeekerProfile?.lastName?.[0]].filter(Boolean).join('') || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                          {[app.jobSeekerProfile?.firstName, app.jobSeekerProfile?.lastName].filter(Boolean).join(' ') || 'Candidate'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {app.job?.title}
                        </div>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

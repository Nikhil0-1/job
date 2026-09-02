'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin, DollarSign, Briefcase, Calendar, Users, GraduationCap,
  Building2, Clock, Globe, ArrowLeft, Smartphone, ExternalLink, Share2
} from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import JobCard from '@/components/public/JobCard';
import { LoadingPage, ErrorState } from '@/components/ui/Skeletons';
import { jobsAPI } from '@/lib/api';
import {
  Job, JOB_TYPE_LABELS, WORK_MODE_LABELS, EXPERIENCE_LABELS,
  formatSalary, getTimeAgo
} from '@/types';
import APP_CONFIG from '@/config/app.config';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    jobsAPI.getJobById(jobId)
      .then(res => {
        setJob(res.data.data.job);
        setRelatedJobs(res.data.data.relatedJobs || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <><Navbar /><LoadingPage /><Footer /></>;
  if (error || !job) return (
    <><Navbar />
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <ErrorState message="Job not found or no longer available." onRetry={() => router.push('/jobs')} />
    </div>
    <Footer /></>
  );

  const initials = job.company?.name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'CO';

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', textDecoration: 'none' }}>
                <ArrowLeft size={16} />
                All Jobs
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>{job.title}</span>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
          <div className="job-detail-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Job Header Card */}
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {/* Logo */}
                  <div style={{
                    width: 72, height: 72, borderRadius: 16,
                    background: job.company?.logo ? 'transparent' : 'var(--primary-50)',
                    border: '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, overflow: 'hidden',
                  }}>
                    {job.company?.logo ? (
                      <Image src={job.company.logo} alt={job.company.name || ''} width={72} height={72} style={{ objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>{initials}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginBottom: '0.375rem' }}>{job.title}</h1>
                    {job.company && (
                      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>
                        {job.company.name}
                        {job.company.city && ` · ${job.company.city}`}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{JOB_TYPE_LABELS[job.jobType]}</span>
                      <span className="badge badge-green">{WORK_MODE_LABELS[job.workMode]}</span>
                      {job.category && <span className="badge badge-gray">{job.category.name}</span>}
                    </div>
                  </div>
                  <button onClick={handleShare} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                    <Share2 size={16} />
                    Share
                  </button>
                </div>

                {/* Meta grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    job.city && { icon: <MapPin size={16} />, label: 'Location', value: [job.city, job.state].filter(Boolean).join(', ') },
                    (job.minSalary || job.maxSalary) && { icon: <DollarSign size={16} />, label: 'Salary', value: formatSalary(job.minSalary, job.maxSalary, job.salaryPeriod) },
                    { icon: <Briefcase size={16} />, label: 'Experience', value: EXPERIENCE_LABELS[job.experience] },
                    job.vacancies && { icon: <Users size={16} />, label: 'Vacancies', value: `${job.vacancies} opening${job.vacancies > 1 ? 's' : ''}` },
                    job.education && { icon: <GraduationCap size={16} />, label: 'Education', value: job.education },
                    job.deadline && { icon: <Calendar size={16} />, label: 'Deadline', value: new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                    { icon: <Clock size={16} />, label: 'Posted', value: getTimeAgo(job.createdAt) },
                    job._count && { icon: <Users size={16} />, label: 'Applicants', value: `${job._count.applications} applied` },
                  ].filter(Boolean).map((item: any, i) => item && (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 10 }}>
                      <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.125rem' }}>{item.label}</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.875rem' }}>Required Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {job.skills.map(skill => (
                        <span key={skill} className="badge badge-blue" style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description sections */}
              {[
                { label: 'Job Description', content: job.description },
                { label: 'Responsibilities', content: job.responsibilities },
                { label: 'Requirements', content: job.requirements },
                { label: 'Benefits', content: job.benefits },
              ].filter(s => s.content).map(section => (
                <div key={section.label} className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>{section.label}</h2>
                  <div
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9375rem' }}
                    dangerouslySetInnerHTML={{ __html: (section.content || '').replace(/\n/g, '<br/>') }}
                  />
                </div>
              ))}

              {/* Related jobs */}
              {relatedJobs.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Similar Jobs</h2>
                  <div className="grid-2">
                    {relatedJobs.map(j => <JobCard key={j.id} job={j} />)}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar — Apply CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ position: 'sticky', top: 90 }}
              className="job-detail-sidebar"
            >
              {/* Apply Card */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem', border: '2px solid var(--primary-100)' }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Apply for this Job</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Applications are submitted through the JobPortal Android app. Download it to apply instantly.
                </p>
                <a
                  href={APP_CONFIG.PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', padding: '0.875rem' }}
                >
                  <Smartphone size={18} />
                  Apply Now — Get the App
                </a>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '1rem', background: 'var(--bg)', borderRadius: 10,
                }}>
                  <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>Download JobPortal App</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available on Google Play</div>
                  </div>
                </div>
              </div>

              {/* Company card */}
              {job.company && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>About the Company</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-50)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {job.company.logo ? (
                        <Image src={job.company.logo} alt={job.company.name} width={48} height={48} style={{ objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{initials}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.company.name}</div>
                      {job.company.industry && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{job.company.industry}</div>}
                    </div>
                  </div>
                  {job.company.about && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {job.company.about.slice(0, 200)}{job.company.about.length > 200 ? '...' : ''}
                    </p>
                  )}
                  {job.company.website && (
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                      <Globe size={14} />
                      Visit Website
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 900px) {
          .job-detail-sidebar { position: static !important; }
        }
      `}</style>
    </>
  );
}

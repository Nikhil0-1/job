'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, MapPin, Briefcase, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import JobCard from '@/components/public/JobCard';
import { JobCardSkeleton, EmptyState, ErrorState } from '@/components/ui/Skeletons';
import { jobsAPI, categoriesAPI } from '@/lib/api';
import { Job, JobCategory } from '@/types';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'];
const WORK_MODES = ['ONSITE', 'REMOTE', 'HYBRID'];
const EXPERIENCE_LEVELS = ['FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'];

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', FREELANCE: 'Freelance', REMOTE: 'Remote',
};
const WORK_MODE_LABELS: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' };
const EXP_LABELS: Record<string, string> = {
  FRESHER: 'Fresher', JUNIOR: 'Junior (1-3 yrs)', MID: 'Mid (3-5 yrs)',
  SENIOR: 'Senior (5-8 yrs)', LEAD: 'Lead (8+ yrs)', EXECUTIVE: 'Executive',
};

function JobsMarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = {
        ...(search && { search }),
        ...(location && { city: location }),
        ...(category && { category }),
        ...(jobType && { jobType }),
        ...(workMode && { workMode }),
        ...(experience && { experience }),
        sortBy,
        order: 'desc',
        page,
        limit: 12,
      };
      const res = await jobsAPI.getPublicJobs(params);
      setJobs(res.data.data.jobs || []);
      setTotalJobs(res.data.data.pagination?.total || 0);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, location, category, jobType, workMode, experience, sortBy, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data.data.categories || [])).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilter = (filterName: string) => {
    const actions: Record<string, () => void> = {
      search: () => setSearch(''),
      location: () => setLocation(''),
      category: () => setCategory(''),
      jobType: () => setJobType(''),
      workMode: () => setWorkMode(''),
      experience: () => setExperience(''),
    };
    actions[filterName]?.();
    setPage(1);
  };

  const activeFilters = [
    search && { key: 'search', label: `"${search}"` },
    location && { key: 'location', label: location },
    category && { key: 'category', label: categories.find(c => c.slug === category)?.name || category },
    jobType && { key: 'jobType', label: JOB_TYPE_LABELS[jobType] },
    workMode && { key: 'workMode', label: WORK_MODE_LABELS[workMode] },
    experience && { key: 'experience', label: EXP_LABELS[experience] },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)', padding: '3rem 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>Browse Jobs</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.0625rem' }}>
            Discover {totalJobs > 0 ? `${totalJobs}+` : 'thousands of'} opportunities across India
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 240, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Job title, company, or keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="City or state..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="jobs-marketplace-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Sidebar Filters */}
          <div style={{ position: 'sticky', top: 90 }} className="filters-sidebar">
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Filters</h3>
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => { setSearch(''); setLocation(''); setCategory(''); setJobType(''); setWorkMode(''); setExperience(''); setPage(1); }}
                    style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category */}
              <FilterSection title="Category">
                <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </FilterSection>

              {/* Job Type */}
              <FilterSection title="Job Type">
                {JOB_TYPES.map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => { setJobType(jobType === type ? '' : type); setPage(1); }}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{JOB_TYPE_LABELS[type]}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Work Mode */}
              <FilterSection title="Work Mode">
                {WORK_MODES.map(mode => (
                  <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name="workMode"
                      checked={workMode === mode}
                      onChange={() => { setWorkMode(workMode === mode ? '' : mode); setPage(1); }}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{WORK_MODE_LABELS[mode]}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Experience */}
              <FilterSection title="Experience">
                <select className="form-select" value={experience} onChange={e => { setExperience(e.target.value); setPage(1); }}>
                  <option value="">Any Experience</option>
                  {EXPERIENCE_LEVELS.map(exp => (
                    <option key={exp} value={exp}>{EXP_LABELS[exp]}</option>
                  ))}
                </select>
              </FilterSection>
            </div>
          </div>

          {/* Jobs List */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                {!loading && (
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {totalJobs} jobs found
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.5rem 0.875rem' }}
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1); }}
                >
                  <option value="createdAt">Latest</option>
                  <option value="salary">Salary</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {activeFilters.map(f => (
                  <span
                    key={f.key}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      background: 'var(--primary-50)', color: 'var(--primary)',
                      padding: '0.375rem 0.875rem', borderRadius: 100,
                      fontSize: '0.875rem', fontWeight: 600,
                    }}
                  >
                    {f.label}
                    <button onClick={() => clearFilter(f.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1, padding: 0 }}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Job grid */}
            {loading ? (
              <div className="grid-2">
                {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <ErrorState message="Failed to load jobs." onRetry={fetchJobs} />
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase size={32} />}
                title="No jobs found"
                description="Try adjusting your search filters or search terms."
                action={
                  <button onClick={() => { setSearch(''); setLocation(''); setCategory(''); setJobType(''); setWorkMode(''); setExperience(''); }} className="btn btn-primary">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <div className="grid-2">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading jobs marketplace...</div>}>
          <JobsMarketplaceContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h4>
      {children}
    </div>
  );
}

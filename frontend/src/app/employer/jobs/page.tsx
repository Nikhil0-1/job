'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, SlidersHorizontal, Eye, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobsAPI } from '@/lib/api';
import { Job } from '@/types';
import { JobStatusBadge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState, ErrorState } from '@/components/ui/Skeletons';
import { getTimeAgo } from '@/types';
import toast from 'react-hot-toast';

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await jobsAPI.getEmployerJobs({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        page,
        limit: 10,
      });
      setJobs(res.data.data.jobs || []);
      setTotal(res.data.data.pagination?.total || 0);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [search, statusFilter, page]);

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await jobsAPI.updateJobStatus(job.id, newStatus);
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus as any } : j));
      toast.success(`Job ${newStatus === 'ACTIVE' ? 'activated' : 'closed'}`);
    } catch {
      toast.error('Failed to update job status');
    }
  };

  const handleDelete = async () => {
    if (!deleteJob) return;
    setDeleting(true);
    try {
      await jobsAPI.deleteJob(deleteJob.id);
      setJobs(prev => prev.filter(j => j.id !== deleteJob.id));
      setTotal(t => t - 1);
      toast.success('Job deleted');
      setDeleteJob(null);
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Jobs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{total} job{total !== 1 ? 's' : ''} posted</p>
        </div>
        <Link href="/employer/jobs/create" className="btn btn-primary">
          <Plus size={18} />
          Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search job title..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {[200, 80, 80, 90, 120].map((w, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16, width: w }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <ErrorState message="Failed to load jobs." onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Plus size={28} />}
          title="No jobs found"
          description={search || statusFilter ? 'Try adjusting your filters.' : 'Post your first job to start receiving applications.'}
          action={!search && !statusFilter ? <Link href="/employer/jobs/create" className="btn btn-primary">Post First Job</Link> : undefined}
        />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type / Mode</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Posted</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</div>
                    {job.city && <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{job.city}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {job.jobType.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{job.workMode}</div>
                  </td>
                  <td>
                    <Link href={`/employer/jobs/${job.id}/applications`} style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                      {job._count?.applications || 0}
                    </Link>
                  </td>
                  <td><JobStatusBadge status={job.status} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{getTimeAgo(job.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Link href={`/jobs/${job.id}`} target="_blank" className="btn btn-ghost btn-sm" title="Preview">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/employer/jobs/${job.id}/edit`} className="btn btn-ghost btn-sm" title="Edit">
                        <Edit2 size={15} />
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={job.status === 'ACTIVE' ? 'Close job' : 'Activate job'}
                        onClick={() => handleToggleStatus(job)}
                        style={{ color: job.status === 'ACTIVE' ? 'var(--warning)' : 'var(--success)' }}
                      >
                        {job.status === 'ACTIVE' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Delete"
                        onClick={() => setDeleteJob(job)}
                        style={{ color: 'var(--error)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={18} /></button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <button key={i + 1} className={`pagination-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={18} /></button>
        </div>
      )}

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteJob?.title}"? This action cannot be undone and all associated applications will be lost.`}
        confirmLabel="Delete Job"
        loading={deleting}
      />
    </div>
  );
}

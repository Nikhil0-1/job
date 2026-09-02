'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { applicationsAPI } from '@/lib/api';
import { Application, ApplicationStatus, APPLICATION_STATUS_LABELS } from '@/types';
import { ApplicationStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, ErrorState, LoadingPage } from '@/components/ui/Skeletons';
import { getTimeAgo } from '@/types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: ApplicationStatus[] = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobIdFilter, setJobIdFilter] = useState(initialJobId);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // For status update modal
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('APPLIED');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await applicationsAPI.getEmployerApplications({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(jobIdFilter && { jobId: jobIdFilter }),
        page,
        limit: 10,
      });
      setApplications(res.data.data.applications || []);
      setTotal(res.data.data.pagination?.total || 0);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [search, statusFilter, jobIdFilter, page]);


  const openUpdateModal = (app: Application) => {
    setViewApp(app);
    setNewStatus(app.status);
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!viewApp) return;
    setUpdating(true);
    try {
      await applicationsAPI.updateStatus(viewApp.id, { status: newStatus, note: statusNote || undefined });
      setApplications(prev => prev.map(a => a.id === viewApp.id ? { ...a, status: newStatus } : a));
      toast.success(`Application status updated to ${APPLICATION_STATUS_LABELS[newStatus]}`);
      setViewApp(null);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (app: Application) => {
    return [app.jobSeekerProfile?.firstName?.[0], app.jobSeekerProfile?.lastName?.[0]].filter(Boolean).join('') || '?';
  };

  const getName = (app: Application) => {
    return [app.jobSeekerProfile?.firstName, app.jobSeekerProfile?.lastName].filter(Boolean).join(' ') || 'Candidate';
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Applications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{total} total application{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or job title..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          style={{
            padding: '0.5rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            border: '1.5px solid',
            borderColor: !statusFilter ? 'var(--primary)' : 'var(--border)',
            background: !statusFilter ? 'var(--primary-50)' : 'white',
            color: !statusFilter ? 'var(--primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          All
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{
              padding: '0.5rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border)',
              background: statusFilter === s ? 'var(--primary-50)' : 'white',
              color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            {APPLICATION_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Candidate</th><th>Job Applied For</th><th>Status</th><th>Applied</th><th>Actions</th></tr></thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{[200, 160, 90, 80, 120].map((w, j) => <td key={j}><div className="skeleton" style={{ height: 16, width: w }} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <ErrorState message="Failed to load applications." onRetry={fetchApplications} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={28} />}
          title="No applications found"
          description={search || statusFilter ? 'Try adjusting your search filters.' : 'When candidates apply for your jobs, they will appear here.'}
        />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Applied For</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Applied</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary)', flexShrink: 0 }}>
                        {getInitials(app)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getName(app)}</div>
                        {app.jobSeekerProfile?.headline && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                            {app.jobSeekerProfile.headline}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.job?.title || 'N/A'}</td>
                  <td>
                    {app.jobSeekerProfile?.skills?.slice(0, 2).map(s => (
                      <span key={s} className="badge badge-gray" style={{ marginRight: '0.25rem', fontSize: '0.75rem' }}>{s}</span>
                    ))}
                    {(app.jobSeekerProfile?.skills?.length || 0) > 2 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{(app.jobSeekerProfile?.skills?.length || 0) - 2}</span>
                    )}
                  </td>
                  <td><ApplicationStatusBadge status={app.status} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{getTimeAgo(app.appliedAt)}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {app.jobSeekerProfile?.resume && (
                        <a href={app.jobSeekerProfile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" title="Download Resume">
                          <Download size={15} />
                        </a>
                      )}
                      <button onClick={() => openUpdateModal(app)} className="btn btn-ghost btn-sm" title="View & Update">
                        <Eye size={15} />
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

      {/* View & Update Application Modal */}
      <Modal isOpen={!!viewApp} onClose={() => setViewApp(null)} title="Application Details" size="md">
        {viewApp && (
          <div>
            {/* Candidate info */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.125rem', color: 'var(--primary)', flexShrink: 0 }}>
                {getInitials(viewApp)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{getName(viewApp)}</h3>
                {viewApp.jobSeekerProfile?.headline && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{viewApp.jobSeekerProfile.headline}</p>}
                {viewApp.jobSeekerProfile?.location && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>📍 {viewApp.jobSeekerProfile.location}</p>}
              </div>
              <ApplicationStatusBadge status={viewApp.status} />
            </div>

            {/* Cover letter */}
            {viewApp.coverLetter && (
              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Cover Letter</p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{viewApp.coverLetter}</p>
              </div>
            )}

            {/* Skills */}
            {viewApp.jobSeekerProfile?.skills && viewApp.jobSeekerProfile.skills.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {viewApp.jobSeekerProfile.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                </div>
              </div>
            )}

            {/* Resume */}
            {viewApp.jobSeekerProfile?.resume && (
              <div style={{ marginBottom: '1.5rem' }}>
                <a href={viewApp.jobSeekerProfile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <Download size={15} />
                  Download Resume
                </a>
              </div>
            )}

            <div className="divider" />

            {/* Update Status */}
            <div>
              <label className="form-label">Update Application Status</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as ApplicationStatus)}
                style={{ marginBottom: '1rem' }}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}
              </select>
              <label className="form-label">Note (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Add a note for this status change (visible in history)..."
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                rows={3}
                style={{ marginBottom: '1.25rem', minHeight: 80 }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setViewApp(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleUpdateStatus} className="btn btn-primary" style={{ flex: 2 }} disabled={updating || newStatus === viewApp.status}>
                  {updating ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <CheckCircle size={16} />}
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ApplicationsContent />
    </Suspense>
  );
}


'use client';

export function JobCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '45%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 100 }} />
        <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 100 }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="skeleton" style={{ height: 16, width: 120 }} />
        <div className="skeleton" style={{ height: 16, width: 100 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ height: 14, width: 80 }} />
        <div className="skeleton" style={{ height: 36, width: 90, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export function ApplicationRowSkeleton() {
  return (
    <tr>
      {[100, 140, 90, 100, 80, 110].map((w, i) => (
        <td key={i}><div className="skeleton" style={{ height: 16, width: w }} /></td>
      ))}
    </tr>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 14, width: 120, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 40, width: 80, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: 100 }} />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 24, width: '50%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '35%' }} />
        </div>
      </div>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: 14, width: 100, marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 44, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading...</p>
    </div>
  );
}

export function EmptyState({
  icon, title, description, action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>{title}</h3>
      {description && <p style={{ maxWidth: 400, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: { message?: string; onRetry?: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: '#FEE2E2' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
          <path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>{message}</h3>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}

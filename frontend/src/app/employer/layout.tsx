'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, Plus, FileText, Building2, Settings,
  LogOut, Menu, X, Bell, ChevronDown, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoadingPage } from '@/components/ui/Skeletons';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
  { href: '/employer/jobs/create', icon: Plus, label: 'Post Job' },
  { href: '/employer/applications', icon: FileText, label: 'Applications' },
  { href: '/employer/company-profile', icon: Building2, label: 'Company Profile' },
  { href: '/employer/settings', icon: Settings, label: 'Settings' },
];

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isEmployer, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Auth guard
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password') || pathname.includes('/reset-password');

  useEffect(() => {
    if (!isLoading && !isAuthPage) {
      if (!isAuthenticated) {
        router.push('/employer/login');
      } else if (!isEmployer) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, isEmployer, isAuthPage, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/employer/login');
  };

  // Show login/register pages without dashboard layout
  if (isAuthPage) return <>{children}</>;

  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated || !isEmployer) return null;

  const isActive = (href: string) => {
    if (href === '/employer/jobs' && pathname.startsWith('/employer/jobs')) {
      return !pathname.includes('/create');
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'white',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transition: 'transform 0.3s',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
      }} className="sidebar">
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="white" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                Job<span style={{ color: 'var(--primary)' }}>Portal</span>
              </span>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Employer Portal</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.25rem 0.875rem', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.25rem', marginBottom: '0.625rem' }}>Menu</p>
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${isActive(href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div style={{ padding: '1rem 0.875rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: 10, marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="var(--primary)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.companyName || 'Employer'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: 'var(--error)', width: '100%' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="main-content">
        {/* Topbar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '0 1.5rem',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: 'var(--text-primary)' }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Page title dynamically */}
          <div className="page-title" style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>
            {navItems.find(n => isActive(n.href))?.label || 'Dashboard'}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/employer/company-profile" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '0.5rem 0.875rem',
              textDecoration: 'none', color: 'var(--text-secondary)',
              fontSize: '0.875rem', fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              <User size={15} />
              <span className="hide-sm">{user?.companyName || 'My Account'}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .dashboard-main {
          flex: 1; padding: 2rem 1.5rem; max-width: 1200px; width: 100%; margin: 0 auto;
        }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .page-title { display: none; }
        }
        @media (max-width: 640px) {
          .dashboard-main { padding: 1.5rem 1rem; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 480px) {
          .hide-sm { display: none !important; }
        }
      `}</style>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import APP_CONFIG from '@/config/app.config';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Find Jobs', href: '/find-jobs' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'For Employers', href: '/for-employers' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'white',
          borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <nav className="container" style={{ display: 'flex', alignItems: 'center', height: 68 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginRight: '3rem' }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--primary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="12" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="14" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Job<span style={{ color: 'var(--primary)' }}>Portal</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="hide-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: 8,
                  fontSize: '0.9375rem',
                  fontWeight: isActive(link.href) ? 600 : 500,
                  color: isActive(link.href) ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive(link.href) ? 'var(--primary-50)' : 'transparent',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    (e.target as HTMLElement).style.background = '#F1F5F9';
                    (e.target as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    (e.target as HTMLElement).style.background = 'transparent';
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hide-mobile">
            <Link href="/employer/login" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
              Employer Login
            </Link>
            <Link href="/employer/register" className="btn btn-primary" style={{ padding: '0.5rem 1.125rem' }}>
              Post a Job
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 8,
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 98,
              }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
                background: 'white', zIndex: 99, padding: '1.5rem',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
                  Job<span style={{ color: 'var(--primary)' }}>Portal</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <X size={22} color="var(--text-secondary)" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      style={{
                        display: 'block',
                        padding: '0.875rem 1rem',
                        borderRadius: 8,
                        fontWeight: isActive(link.href) ? 600 : 500,
                        color: isActive(link.href) ? 'var(--primary)' : 'var(--text-primary)',
                        background: isActive(link.href) ? 'var(--primary-50)' : 'transparent',
                        textDecoration: 'none',
                        fontSize: '1rem',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/employer/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Employer Login
                </Link>
                <Link href="/employer/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Post a Job
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

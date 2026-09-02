'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';
import APP_CONFIG from '@/config/app.config';

const footerLinks = {
  Platform: [
    { label: 'Find Jobs', href: '/find-jobs' },
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  Employers: [
    { label: 'Post a Job', href: '/employer/register' },
    { label: 'Employer Login', href: '/employer/login' },
    { label: 'Register', href: '/employer/register' },
    { label: 'For Employers', href: '/for-employers' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/about#contact' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

const socialIcons = [
  {
    label: 'Twitter',
    href: APP_CONFIG.SOCIAL.TWITTER,
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: APP_CONFIG.SOCIAL.LINKEDIN,
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: APP_CONFIG.SOCIAL.FACEBOOK,
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: APP_CONFIG.SOCIAL.INSTAGRAM,
    svg: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8' }}>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        {/* Top section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="12" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="10" y1="14" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.03em' }}>
                Job<span style={{ color: '#3B82F6' }}>Portal</span>
              </span>
            </Link>
            <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 280, fontSize: '0.9375rem' }}>
              Connecting talented professionals with the best employers across India. Find your dream job or hire great talent.
            </p>

            {/* App Download CTA */}
            <div style={{ background: '#1E293B', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                📱 Job Seekers — Get the App
              </p>
              <a
                href={APP_CONFIG.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'white', color: '#0F172A', padding: '0.625rem 1rem',
                  borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.33.18.7.24 1.06.18L15.5 12 4.24.06C3.88 0 3.51.06 3.18.24A2 2 0 0 0 2 2.06v19.88c0 .8.44 1.52 1.18 1.82z"/>
                  <path d="M19.5 10.24l-2.84-1.64-3.48 3.48 3.48 3.48 2.88-1.66a2 2 0 0 0 0-3.66z"/>
                </svg>
                Download on Google Play
              </a>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialIcons.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36, height: 36, background: '#1E293B', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748B', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1E293B';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{ color: '#64748B', fontSize: '0.9375rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

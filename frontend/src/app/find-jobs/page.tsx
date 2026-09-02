'use client';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import APP_CONFIG from '@/config/app.config';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Download, Smartphone, Search, Star, Bell, CheckCircle,
  Briefcase, Users, TrendingUp, Shield, ArrowRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function FindJobsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #0EA5E9 100%)',
          padding: '6rem 0 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          </div>

          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.span variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                <Smartphone size={14} /> Available on Android
              </motion.span>
              <motion.h1 variants={fadeUp} style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Find Jobs Through Our App
              </motion.h1>
              <motion.p variants={fadeUp} style={{ color: '#BFDBFE', fontSize: '1.125rem', maxWidth: 580, margin: '0 auto 3rem', lineHeight: 1.7 }}>
                Job seekers use our Android app to search, apply, and track opportunities. Download it free from Google Play Store.
              </motion.p>
              <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={APP_CONFIG.PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    background: 'white', color: '#0F172A',
                    padding: '1rem 2rem', borderRadius: 12,
                    fontWeight: 700, fontSize: '1.0625rem', textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <Download size={22} color="#2563EB" />
                  Download on Google Play
                </a>
                <Link href="/jobs" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  padding: '1rem 2rem', borderRadius: 12,
                  fontWeight: 700, fontSize: '1.0625rem', textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'background 0.2s',
                }}>
                  Browse Jobs Online
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Everything a Job Seeker Needs</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: '1.0625rem' }}>
                The JobPortal app is your complete career companion — search, apply, and track all your applications in one place.
              </p>
            </div>

            <div className="grid-3">
              {[
                { icon: <Search size={24} />, title: 'Smart Job Search', desc: 'Filter by location, salary, type, experience and more to find your perfect role' },
                { icon: <CheckCircle size={24} />, title: 'One-Tap Apply', desc: 'Apply instantly with your saved profile and resume — no retyping every time' },
                { icon: <Bell size={24} />, title: 'Real-Time Alerts', desc: 'Get notified the moment your application status changes' },
                { icon: <Star size={24} />, title: 'Profile Builder', desc: 'Create a professional profile that stands out to employers' },
                { icon: <TrendingUp size={24} />, title: 'Track Applications', desc: 'See all your applications and their statuses in one dashboard' },
                { icon: <Shield size={24} />, title: 'Verified Jobs', desc: 'All job postings are from verified, trusted employers on the platform' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card"
                  style={{ padding: '1.75rem' }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--primary)' }}>
                    {feature.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{feature.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: '4rem', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, background: 'var(--primary-50)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Smartphone size={32} color="var(--primary)" />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Ready to Find Your Dream Job?</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 2.5rem', fontSize: '1.0625rem' }}>
                Download the JobPortal app and start browsing thousands of opportunities from top employers across India.
              </p>
              <a
                href={APP_CONFIG.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xl"
              >
                <Download size={20} />
                Download JobPortal App — Free
              </a>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                Available on Android · Free to download
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

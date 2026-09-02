'use client';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import APP_CONFIG from '@/config/app.config';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase, CheckCircle, BarChart2, Users, Smartphone, ArrowRight,
  Building2, FileText, TrendingUp, Plus, Star
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function ForEmployersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0F9FF 100%)', padding: '6rem 0', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.span variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#D1FAE5', color: '#059669', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid #A7F3D0' }}>
                <Building2 size={14} /> For Employers
              </motion.span>
              <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Hire Smarter, Hire Faster
              </motion.h1>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: 580, margin: '0 auto 3rem', lineHeight: 1.7 }}>
                Post jobs, manage applications, and find your next great hire — all from one powerful employer dashboard.
              </motion.p>
              <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/employer/register" className="btn btn-primary btn-xl">
                  <Plus size={20} />
                  Start Hiring Free
                </Link>
                <Link href="/employer/login" className="btn btn-secondary btn-xl">
                  Employer Login
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>The Complete Hiring Platform</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: '1.0625rem' }}>
                Everything you need to find, evaluate, and hire the right candidates — all in one place.
              </p>
            </div>
            <div className="grid-3">
              {[
                { icon: <Briefcase size={24} />, title: 'Job Posting', desc: 'Create and publish detailed job listings that attract the right talent in minutes.' },
                { icon: <Users size={24} />, title: 'Application Management', desc: 'Review all applications, filter candidates, and manage your hiring pipeline efficiently.' },
                { icon: <FileText size={24} />, title: 'Resume Review', desc: 'Access candidate profiles, resumes, cover letters, and skill sets in one view.' },
                { icon: <BarChart2 size={24} />, title: 'Analytics Dashboard', desc: 'Track job views, application rates, and hiring metrics with real-time insights.' },
                { icon: <Building2 size={24} />, title: 'Company Profile', desc: 'Build a compelling employer brand that attracts top candidates to apply.' },
                { icon: <Smartphone size={24} />, title: 'Mobile Reach', desc: 'Reach job seekers on our Android app — the platform they are already using.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="card"
                  style={{ padding: '1.75rem' }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#059669' }}>
                    {f.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Simple, Transparent Pricing</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>Start for free. Scale as you grow.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800, margin: '0 auto' }} className="pricing-grid">
              {[
                {
                  name: 'Free',
                  price: '₹0',
                  period: 'forever',
                  features: ['5 active job posts', 'Basic candidate management', 'Company profile', 'Application tracking'],
                  cta: 'Get Started Free',
                  href: '/employer/register',
                  highlighted: false,
                },
                {
                  name: 'Pro',
                  price: '₹1,999',
                  period: 'per month',
                  features: ['Unlimited job posts', 'Advanced analytics', 'Priority listing', 'Featured employer badge', 'Email notifications', 'Dedicated support'],
                  cta: 'Coming Soon',
                  href: '/employer/register',
                  highlighted: true,
                },
              ].map(plan => (
                <div
                  key={plan.name}
                  className="card"
                  style={{
                    padding: '2.5rem',
                    border: plan.highlighted ? '2px solid var(--primary)' : '1px solid var(--border)',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {plan.highlighted && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: 100, fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      Coming Soon
                    </div>
                  )}
                  <h3 style={{ marginBottom: '0.5rem' }}>{plan.name}</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{plan.price}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{plan.period}</div>
                  <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textAlign: 'left' }}>
                        <CheckCircle size={16} color="#059669" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={`btn ${plan.highlighted ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 640px) {
              .pricing-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* CTA */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container-sm" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Start Hiring Today</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', marginBottom: '2.5rem' }}>
              Join thousands of employers finding great talent on JobPortal. Free to get started.
            </p>
            <Link href="/employer/register" className="btn btn-primary btn-xl">
              <Building2 size={20} />
              Create Free Employer Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Users, TrendingUp, Shield,
  Star, CheckCircle, ArrowRight, Download, Smartphone,
  Building2, BarChart2, Bell, Clock, Globe, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FAQAccordion from '@/components/public/FAQAccordion';
import JobCard from '@/components/public/JobCard';
import APP_CONFIG from '@/config/app.config';
import { jobsAPI } from '@/lib/api';
import { Job } from '@/types';
import { JobCardSkeleton } from '@/components/ui/Skeletons';
import type { Metadata } from 'next';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const faqItems = [
  {
    question: 'How do I find jobs on JobPortal?',
    answer: 'Download our Android app from the Google Play Store to search, filter, and apply for thousands of jobs. You can search by category, location, salary, experience level, and more.',
  },
  {
    question: 'How do candidates apply for jobs?',
    answer: 'Candidates apply through the JobPortal Android app. Create your profile, upload your resume, and apply with one tap. You can track the status of all your applications in real-time.',
  },
  {
    question: 'Do I need an account to browse jobs?',
    answer: 'You can browse job listings on our website without an account. However, to apply for jobs, save opportunities, and track applications, you need to create a free account on the Android app.',
  },
  {
    question: 'How can employers post jobs?',
    answer: 'Employers register on the website, create a company profile, and can immediately start posting jobs. Our employer dashboard makes it easy to manage all your job listings in one place.',
  },
  {
    question: 'Can employers manage applications online?',
    answer: 'Yes! Employers get a full-featured dashboard to view all applications, review candidate profiles and resumes, and update application status (Under Review, Shortlisted, Selected, Rejected).',
  },
  {
    question: 'Is the mobile app required to apply for jobs?',
    answer: 'Yes, job applications are submitted through the Android app to ensure a consistent, optimized experience for job seekers. The website is designed for employers and job discovery.',
  },
];

const howItWorksSeeker = [
  { step: 1, title: 'Download App', desc: 'Get the JobPortal app from Google Play Store for free' },
  { step: 2, title: 'Create Profile', desc: 'Build your professional profile and upload your resume' },
  { step: 3, title: 'Search Jobs', desc: 'Browse thousands of jobs with smart filters' },
  { step: 4, title: 'Apply Instantly', desc: 'Apply with one tap and track your applications' },
];

const howItWorksEmployer = [
  { step: 1, title: 'Register', desc: 'Create your free employer account in minutes' },
  { step: 2, title: 'Company Profile', desc: 'Set up your company profile to attract top talent' },
  { step: 3, title: 'Post a Job', desc: 'Reach thousands of active job seekers instantly' },
  { step: 4, title: 'Hire', desc: 'Review candidates, shortlist, and make your hire' },
];

const whyChooseUs = [
  { icon: <Shield size={24} />, title: 'Verified Listings', desc: 'All job postings are from verified employers on our platform.' },
  { icon: <Briefcase size={24} />, title: 'Easy Recruitment', desc: 'Streamlined hiring tools designed for modern employers.' },
  { icon: <Smartphone size={24} />, title: 'Mobile-First', desc: 'Job seekers apply via our intuitive Android application.' },
  { icon: <Globe size={24} />, title: 'Wide Reach', desc: 'Connect with talent and opportunities across India.' },
  { icon: <BarChart2 size={24} />, title: 'Smart Insights', desc: 'Track your hiring pipeline with real-time analytics.' },
  { icon: <Bell size={24} />, title: 'Instant Notifications', desc: 'Candidates get notified the moment their status updates.' },
];

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getPublicJobs({ limit: 6, sortBy: 'createdAt', order: 'desc' })
      .then(res => setFeaturedJobs(res.data.data.jobs || []))
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>

        {/* ========== HERO ========== */}
        <section style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F8FAFC 100%)',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, background: 'rgba(37,99,235,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'rgba(14,165,233,0.05)', borderRadius: '50%' }} />
          </div>

          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
              {/* Left: Content */}
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--primary-50)', color: 'var(--primary)',
                    padding: '0.375rem 1rem', borderRadius: 100,
                    fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem',
                    border: '1px solid var(--primary-100)',
                  }}>
                    <Star size={14} fill="currentColor" />
                    India's Premier Job Portal
                  </span>
                </motion.div>

                <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                  Find Opportunities.{' '}
                  <span className="text-gradient">Hire Great Talent.</span>
                </motion.h1>

                <motion.p variants={fadeUp} style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 480 }}>
                  Connect talented job seekers with companies looking for their next great hire. The platform trusted by thousands of employers and candidates across India.
                </motion.p>

                {/* Dual CTA — NEVER MIX JOB SEEKER AND EMPLOYER ACTIONS */}
                <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Looking for a Job?</span>
                    <a
                      href={APP_CONFIG.PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-xl"
                    >
                      <Smartphone size={20} />
                      Find Jobs — Get the App
                    </a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hiring Candidates?</span>
                    <Link href="/employer/register" className="btn btn-secondary btn-xl">
                      <Briefcase size={20} />
                      Post a Job
                    </Link>
                  </div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Jobs Posted', value: '10,000+' },
                    { label: 'Employers', value: '2,000+' },
                    { label: 'Placements', value: '50,000+' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{value}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right: Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{ position: 'relative' }}
                className="hero-illustration"
              >
                <HeroIllustration />
              </motion.div>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 768px) {
              .hero-illustration { display: none !important; }
            }
          `}</style>
        </section>

        {/* ========== SECTION 2: FIND YOUR NEXT OPPORTUNITY ========== */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <motion.div variants={fadeUp}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid var(--primary-100)' }}>
                  <Smartphone size={14} />
                  For Job Seekers
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>
                Find Your Next Opportunity
              </motion.h2>
              <motion.p variants={fadeUp} style={{ maxWidth: 600, margin: '0 auto 2rem', fontSize: '1.0625rem' }}>
                Discover thousands of opportunities across every industry and location in India. All through our powerful Android app.
              </motion.p>
              <motion.div variants={fadeUp}>
                <a href={APP_CONFIG.PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <Download size={18} />
                  Download the App
                </a>
              </motion.div>
            </motion.div>

            <div className="grid-4">
              {[
                { icon: <Search size={22} />, title: 'Smart Search', desc: 'Search by title, company, location, or skills' },
                { icon: <MapPin size={22} />, title: 'Location Filter', desc: 'Find opportunities near you or anywhere in India' },
                { icon: <Users size={22} />, title: 'Build Profile', desc: 'Create a standout profile that attracts employers' },
                { icon: <TrendingUp size={22} />, title: 'Track Applications', desc: 'Monitor every application and get real-time updates' },
                { icon: <Briefcase size={22} />, title: 'All Categories', desc: 'Jobs across technology, design, finance, and 50+ fields' },
                { icon: <Star size={22} />, title: 'Resume Upload', desc: 'Upload your resume once, apply to any job' },
                { icon: <Bell size={22} />, title: 'Job Alerts', desc: 'Get notified of new jobs matching your preferences' },
                { icon: <CheckCircle size={22} />, title: 'One-Tap Apply', desc: 'Apply instantly with your saved profile' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.07 } } }}
                  className="card"
                  style={{ padding: '1.5rem', textAlign: 'center' }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                    {item.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SECTION 3: HIRE THE RIGHT TALENT ========== */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
              {/* Employer illustration */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="employer-illustration"
              >
                <EmployerIllustration />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div variants={fadeUp}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#D1FAE5', color: '#059669', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid #A7F3D0' }}>
                    <Building2 size={14} />
                    For Employers
                  </span>
                </motion.div>
                <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>
                  Hire the Right Talent
                </motion.h2>
                <motion.p variants={fadeUp} style={{ marginBottom: '2rem', fontSize: '1.0625rem', color: 'var(--text-secondary)' }}>
                  Reach thousands of active job seekers and find your perfect candidate faster. Our employer tools make the entire hiring process effortless.
                </motion.p>
                <motion.div variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    'Post unlimited jobs and reach active candidates',
                    'Manage all applications from one dashboard',
                    'Review candidate profiles, resumes, and skills',
                    'Shortlist and update candidate status in real-time',
                    'Build a professional company profile',
                    'Track hiring metrics and pipeline performance',
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/employer/register" className="btn btn-primary btn-lg">
                    Start Hiring Free
                  </Link>
                  <Link href="/for-employers" className="btn btn-secondary btn-lg">
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 768px) {
              .employer-illustration { display: none !important; }
              section > div > div:last-child { grid-column: 1 !important; }
            }
          `}</style>
        </section>

        {/* ========== SECTION 4: HOW IT WORKS ========== */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>How It Works</motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1.0625rem' }}>
                Whether you're a job seeker or an employer, getting started takes just minutes.
              </motion.p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
              {/* Job Seeker Flow */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--primary-50)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={20} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem' }}>For Job Seekers</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {howItWorksSeeker.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: '1.25rem', paddingBottom: i < howItWorksSeeker.length - 1 ? '2rem' : 0 }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'var(--primary)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.9375rem', flexShrink: 0,
                        }}>
                          {item.step}
                        </div>
                        {i < howItWorksSeeker.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 8 }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < howItWorksSeeker.length - 1 ? '1rem' : 0 }}>
                        <h4 style={{ marginBottom: '0.375rem' }}>{item.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <a href={APP_CONFIG.PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                  <Download size={18} />
                  Download the App
                </a>
              </div>

              {/* Employer Flow */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ width: 40, height: 40, background: '#D1FAE5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} color="#059669" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem' }}>For Employers</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {howItWorksEmployer.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: '1.25rem', paddingBottom: i < howItWorksEmployer.length - 1 ? '2rem' : 0 }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: '#059669', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.9375rem', flexShrink: 0,
                        }}>
                          {item.step}
                        </div>
                        {i < howItWorksEmployer.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 8 }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < howItWorksEmployer.length - 1 ? '1rem' : 0 }}>
                        <h4 style={{ marginBottom: '0.375rem' }}>{item.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link href="/employer/register" className="btn btn-primary" style={{ marginTop: '2rem', background: '#059669', borderColor: '#059669' }}>
                  <Building2 size={18} />
                  Start Hiring Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 5: APP PROMO ========== */}
        <section className="section" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeUp} style={{ color: '#93C5FD', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  Android App
                </motion.p>
                <motion.h2 variants={fadeUp} style={{ color: 'white', marginBottom: '1.5rem', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                  Your next opportunity is just a tap away.
                </motion.h2>
                <motion.p variants={fadeUp} style={{ color: '#BFDBFE', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.0625rem' }}>
                  The JobPortal app gives job seekers everything they need — a smart job search, instant applications, profile builder, resume upload, and real-time application tracking. All in one elegant app.
                </motion.p>
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href={APP_CONFIG.PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                      background: 'white', color: '#0F172A',
                      padding: '0.875rem 1.5rem', borderRadius: 10,
                      fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#2563EB">
                      <path d="M3.18 23.76c.33.18.7.24 1.06.18L15.5 12 4.24.06C3.88 0 3.51.06 3.18.24A2 2 0 0 0 2 2.06v19.88c0 .8.44 1.52 1.18 1.82z"/>
                      <path d="M19.5 10.24l-2.84-1.64-3.48 3.48 3.48 3.48 2.88-1.66a2 2 0 0 0 0-3.66z"/>
                    </svg>
                    Download on Google Play
                  </a>
                  <Link href="/find-jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '0.875rem 1.5rem', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 10 }}>
                    Start Finding Jobs
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', justifyContent: 'center' }}
                className="app-phones"
              >
                <AppPhoneIllustration />
              </motion.div>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) { .app-phones { display: none !important; } }
          `}</style>
        </section>

        {/* ========== SECTION 6: FEATURED JOBS ========== */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div>
                <motion.h2 variants={fadeUp} style={{ marginBottom: '0.5rem' }}>Featured Jobs</motion.h2>
                <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)' }}>Latest opportunities from top employers</motion.p>
              </div>
              <motion.div variants={fadeUp}>
                <Link href="/jobs" className="btn btn-secondary">
                  View All Jobs
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid-3">
              {jobsLoading
                ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
                : featuredJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))
              }
            </div>

            {!jobsLoading && featuredJobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No jobs available yet. Check back soon!</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginTop: '3rem' }}
            >
              <Link href="/jobs" className="btn btn-primary btn-lg">
                Browse All Jobs
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 7: WHY CHOOSE US ========== */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>Why Choose JobPortal?</motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1.0625rem' }}>
                Built for the modern hiring ecosystem — whether you're a job seeker or an employer.
              </motion.p>
            </motion.div>

            <div className="grid-3">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card"
                  style={{ padding: '2rem' }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--primary)' }}>
                    {item.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.625rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SECTION 8: EMPLOYER CTA ========== */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 24, padding: '4rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}
            >
              <motion.div variants={fadeUp} style={{ width: 64, height: 64, background: 'var(--primary-50)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Building2 size={28} />
              </motion.div>
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>Ready to Find Your Next Great Hire?</motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2.5rem', fontSize: '1.0625rem' }}>
                Join thousands of employers who trust JobPortal to connect them with exceptional talent across India. Post your first job for free.
              </motion.p>
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/employer/register" className="btn btn-primary btn-xl">
                  <Briefcase size={20} />
                  Post a Job Free
                </Link>
                <Link href="/employer/login" className="btn btn-secondary btn-xl">
                  Employer Login
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 9: FAQ ========== */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container-sm">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <motion.h2 variants={fadeUp} style={{ marginBottom: '1rem' }}>Frequently Asked Questions</motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
                Everything you need to know about the platform.
              </motion.p>
            </motion.div>
            <FAQAccordion items={faqItems} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

// ---- Inline SVG Illustrations ----

function HeroIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
      {/* Main card */}
      <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 20px 60px rgba(37,99,235,0.12)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ width: 48, height: 48, background: 'var(--primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={22} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Senior Developer</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>TechCorp Solutions · Hyderabad</div>
          </div>
          <div style={{ marginLeft: 'auto', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.8125rem', fontWeight: 600 }}>Active</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {['Full Time', 'Hybrid', 'Technology'].map(tag => (
            <span key={tag} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.25rem 0.625rem', borderRadius: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{tag}</span>
          ))}
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Salary Range</div>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.125rem' }}>₹12L – ₹20L/year</div>
        </div>
        {/* Application stats mini */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[{ label: 'Applicants', value: '142' }, { label: 'Vacancies', value: '3' }, { label: 'Days Left', value: '28' }].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', background: 'var(--bg)', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: -24, right: -24,
          background: 'white', borderRadius: 14, padding: '0.875rem 1.125rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.625rem',
        }}
      >
        <div style={{ width: 36, height: 36, background: '#D1FAE5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={18} color="#059669" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Shortlisted!</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your application was reviewed</div>
        </div>
      </motion.div>

      {/* Floating new job pill */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', bottom: -20, left: -20,
          background: 'var(--primary)', borderRadius: 14, padding: '0.75rem 1.125rem',
          boxShadow: '0 12px 32px rgba(37,99,235,0.25)',
          display: 'flex', alignItems: 'center', gap: '0.625rem',
        }}
      >
        <Bell size={18} color="white" />
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>12 new jobs today</span>
      </motion.div>
    </div>
  );
}

function EmployerIllustration() {
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Hiring Dashboard</div>
      {[
        { name: 'Priya Sharma', role: 'Senior Developer', status: 'SHORTLISTED', color: '#7C3AED', bg: '#EDE9FE' },
        { name: 'Arjun Mehta', role: 'UI/UX Designer', status: 'SELECTED', color: '#059669', bg: '#D1FAE5' },
        { name: 'Ananya Singh', role: 'Data Analyst', status: 'UNDER REVIEW', color: '#D97706', bg: '#FEF3C7' },
        { name: 'Vikram Nair', role: 'DevOps Engineer', status: 'APPLIED', color: '#2563EB', bg: '#DBEAFE' },
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', borderRadius: 10, background: i % 2 === 0 ? 'var(--bg)' : 'white', marginBottom: i < 3 ? '0.5rem' : 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: c.color, flexShrink: 0 }}>
            {c.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.role}</div>
          </div>
          <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.625rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.status}</span>
        </div>
      ))}
    </div>
  );
}

function AppPhoneIllustration() {
  return (
    <div style={{
      width: 260, height: 480,
      background: '#1E293B',
      borderRadius: 40,
      padding: '2rem 1.25rem',
      boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
      border: '6px solid #334155',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.7rem', color: '#94A3B8' }}>
        <span>9:41</span>
        <span>📶 🔋</span>
      </div>
      {/* App header */}
      <div style={{ color: 'white', fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.75rem' }}>
        Job<span style={{ color: '#60A5FA' }}>Portal</span>
      </div>
      <div style={{ background: '#334155', borderRadius: 10, padding: '0.625rem 0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={14} color="#64748B" />
        <span style={{ color: '#64748B', fontSize: '0.8125rem' }}>Search jobs...</span>
      </div>
      {/* Job items */}
      {[
        { title: 'Sr. Developer', company: 'TechCorp', salary: '₹15L', badge: 'New' },
        { title: 'UI Designer', company: 'DesignHub', salary: '₹10L', badge: 'Hot' },
        { title: 'Data Analyst', company: 'FinanceFirst', salary: '₹9L', badge: '' },
      ].map((job, i) => (
        <div key={i} style={{ background: '#334155', borderRadius: 10, padding: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.8125rem' }}>{job.title}</span>
            {job.badge && <span style={{ background: '#2563EB', color: 'white', padding: '0.125rem 0.5rem', borderRadius: 100, fontSize: '0.6875rem', fontWeight: 700 }}>{job.badge}</span>}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{job.company}</div>
          <div style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem' }}>{job.salary}/yr</div>
        </div>
      ))}
    </div>
  );
}

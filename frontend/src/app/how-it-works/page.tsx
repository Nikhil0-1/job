'use client';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FAQAccordion from '@/components/public/FAQAccordion';
import { motion } from 'framer-motion';
import Link from 'next/link';
import APP_CONFIG from '@/config/app.config';
import { Smartphone, Building2, ArrowRight, Download } from 'lucide-react';

const seekerFAQ = [
  { question: 'How do I apply for jobs?', answer: 'Download the JobPortal Android app from Google Play Store. Create your profile, upload your resume, and apply to any job with a single tap.' },
  { question: 'Is the app free?', answer: 'Yes, the JobPortal app is completely free to download and use. There are no charges for browsing jobs or applying.' },
  { question: 'How do I know if my application was accepted?', answer: 'You will receive real-time notifications in the app whenever your application status changes. You can also track all applications in the "My Applications" section.' },
  { question: 'Can I apply without uploading a resume?', answer: 'You can browse jobs without a resume, but most employers require one to consider your application. We recommend uploading one for better results.' },
  { question: 'Are the job listings verified?', answer: 'Yes, all employers are verified before their jobs are listed on our platform, ensuring you only see legitimate opportunities.' },
];

const employerFAQ = [
  { question: 'How do I post a job?', answer: 'Register as an employer, complete your company profile, and then click "Post a Job". Fill in the job details and hit publish — your listing goes live immediately.' },
  { question: 'How much does it cost to post a job?', answer: 'You can post up to 5 jobs for free. Premium plans with unlimited postings and advanced features are coming soon.' },
  { question: 'How do I review applications?', answer: 'All applications appear in your employer dashboard under "Applications". You can view profiles, resumes, cover letters, and update the application status.' },
  { question: 'Can multiple team members use one account?', answer: 'Currently, each employer account is single-user. Multi-user team support is on our roadmap.' },
  { question: 'How do I update a job listing?', answer: 'Go to "My Jobs", click the edit icon on any job, make your changes, and save. Updates go live immediately.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)', padding: '5rem 0', textAlign: 'center' }}>
          <div className="container">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
              How JobPortal Works
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto' }}>
              A simple, powerful platform connecting job seekers with employers across India.
            </motion.p>
          </div>
        </section>

        {/* For Seekers */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid var(--primary-100)' }}>
                  <Smartphone size={14} /> For Job Seekers
                </span>
                <h2 style={{ marginBottom: '1rem' }}>Your Path to the Right Job</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Job seeking is done through our Android app — where you can search, apply, and track all your opportunities in one place.
                </p>
                {[
                  { step: '01', title: 'Download the App', desc: 'Get the JobPortal Android app free from Google Play Store.' },
                  { step: '02', title: 'Build Your Profile', desc: 'Create a compelling profile and upload your resume.' },
                  { step: '03', title: 'Browse & Search', desc: 'Filter thousands of jobs by role, location, salary, and more.' },
                  { step: '04', title: 'Apply Instantly', desc: 'Apply with one tap and track all your applications.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                      {item.step}
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{item.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
                <a href={APP_CONFIG.PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <Download size={18} />
                  Download the App
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 24, padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📱</div>
                  <h3 style={{ marginBottom: '1rem' }}>Get the App</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                    The JobPortal app is designed to give job seekers the best possible experience — from discovery to offer.
                  </p>
                  <a href={APP_CONFIG.PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <Download size={18} />
                    Google Play Store
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 24, padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏢</div>
                  <h3 style={{ marginBottom: '1rem' }}>Employer Dashboard</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                    Manage your entire hiring pipeline from one powerful web dashboard.
                  </p>
                  <Link href="/employer/register" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669', justifyContent: 'center' }}>
                    <Building2 size={18} />
                    Start Hiring Free
                  </Link>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#D1FAE5', color: '#059669', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid #A7F3D0' }}>
                  <Building2 size={14} /> For Employers
                </span>
                <h2 style={{ marginBottom: '1rem' }}>Streamlined Hiring</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  From posting a job to making a hire, our employer platform makes every step simple and efficient.
                </p>
                {[
                  { step: '01', title: 'Register & Setup', desc: 'Create your employer account and complete your company profile.' },
                  { step: '02', title: 'Post Jobs', desc: 'Create detailed job listings with all the info candidates need.' },
                  { step: '03', title: 'Review Candidates', desc: 'Browse applications, view profiles and resumes at a glance.' },
                  { step: '04', title: 'Make Your Hire', desc: 'Shortlist, interview, and update status — all from the dashboard.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                      {item.step}
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{item.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="faq-grid">
              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', color: 'var(--primary)' }}>
                  <Smartphone size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  For Job Seekers
                </h3>
                <FAQAccordion items={seekerFAQ} />
              </div>
              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', color: '#059669' }}>
                  <Building2 size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  For Employers
                </h3>
                <FAQAccordion items={employerFAQ} />
              </div>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .faq-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </>
  );
}

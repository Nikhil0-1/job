'use client';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Target, Users, Star, Heart } from 'lucide-react';
import APP_CONFIG from '@/config/app.config';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)', padding: '5rem 0', textAlign: 'center' }}>
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.h1 variants={fadeUp} style={{ marginBottom: '1rem' }}>About JobPortal</motion.h1>
              <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: 580, margin: '0 auto' }}>
                Connecting India's workforce — one opportunity at a time.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.375rem 1rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  <Target size={14} /> Our Mission
                </span>
                <h2 style={{ marginBottom: '1.25rem' }}>Democratizing Access to Opportunity</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.0625rem' }}>
                  JobPortal was built with a single mission: make it easy for every qualified candidate in India to find great work, and for every employer to find the talent they need to grow.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.0625rem' }}>
                  We believe that the right job match has the power to change lives. We've built a modern, mobile-first platform that makes the process simple, transparent, and fast — for everyone involved.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {[
                    { icon: <Target size={24} />, title: 'Mission-Driven', desc: 'Connecting talent with opportunity across India' },
                    { icon: <Users size={24} />, title: 'Community First', desc: 'Built for job seekers and employers equally' },
                    { icon: <Star size={24} />, title: 'Quality Focus', desc: 'Only verified jobs from trusted employers' },
                    { icon: <Heart size={24} />, title: 'Made in India', desc: 'Built by a team passionate about Indian careers' },
                  ].map((item, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <div style={{ width: 48, height: 48, background: 'var(--primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                        {item.icon}
                      </div>
                      <h4 style={{ marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }} className="stats-grid-about">
              {[
                { value: '10,000+', label: 'Jobs Posted' },
                { value: '2,000+', label: 'Employers' },
                { value: '50,000+', label: 'Candidates Reached' },
                { value: '500+', label: 'Cities Covered' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: '#93C5FD', marginTop: '0.5rem', fontWeight: 500 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 640px) {
              .stats-grid-about { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </section>

        {/* Contact */}
        <section id="contact" className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Get In Touch</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
                Questions, feedback, or partnership inquiries? We'd love to hear from you.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: 800, margin: '0 auto' }} className="contact-grid">
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { icon: <Mail size={20} />, label: 'Email', value: 'hello@jobportal.in', href: 'mailto:hello@jobportal.in' },
                    { icon: <Phone size={20} />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                    { icon: <MapPin size={20} />, label: 'Location', value: 'Hyderabad, Telangana, India', href: '#' },
                  ].map(c => (
                    <div key={c.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, background: 'var(--primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{c.label}</div>
                        <a href={c.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>{c.value}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={e => { e.preventDefault(); alert('Message sent! (Demo mode)'); }}>
                <div>
                  <label className="form-label">Your Name</label>
                  <input className="form-input" placeholder="Priya Sharma" required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="priya@example.com" required />
                </div>
                <div>
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Your message..." rows={4} required />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Mail size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 640px) {
              .contact-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </>
  );
}

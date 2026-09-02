'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-xl)', padding: '2.5rem', width: '100%', maxWidth: 440 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Job<span style={{ color: 'var(--primary)' }}>Portal</span>
            </span>
          </Link>
        </div>

        {!sent ? (
          <>
            <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.625rem' }}>Forgot Password?</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={isLoading}>
                {isLoading ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : null}
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={32} color="#059669" />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Check Your Email</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              We've sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link within 1 hour.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              In development mode, the reset link is logged to the server console.
            </p>
          </motion.div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/employer/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

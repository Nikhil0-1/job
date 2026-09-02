'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Briefcase, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

function EmployerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sessionExpired = searchParams.get('session') === 'expired';

  useEffect(() => {
    if (isAuthenticated) router.replace('/employer/dashboard');
  }, [isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email: data.email, password: data.password });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        toast.success('Welcome back!');
        router.push('/employer/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {sessionExpired && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
            <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#92400E', fontSize: '0.9rem', margin: 0 }}>Your session has expired. Please log in again.</p>
          </div>
        )}

        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Employer Login</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Don't have an account?{' '}
          <Link href="/employer/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register free</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="hr@company.com" {...register('email')} />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Your password"
                {...register('password')}
                style={{ paddingRight: '3rem' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" {...register('rememberMe')} style={{ accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Remember me</span>
            </label>
            <Link href="/employer/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={isLoading}>
            {isLoading ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : null}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 0.5rem', fontWeight: 600 }}>Demo Employer Accounts:</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            hiring@techcorp.com<br />
            hr@designhub.com<br />
            Password: <strong>Password123!</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function EmployerLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">
      {/* Left — Brand */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="auth-brand">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>JobPortal</span>
        </Link>
        <div>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Manage Your Hiring Pipeline
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            Access your employer dashboard to manage job postings, review applications, and find your next great hire.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
            {[{ label: 'Jobs Posted', val: '10K+' }, { label: 'Employers', val: '2K+' }, { label: 'Hires Made', val: '50K+' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{s.val}</div>
                <div style={{ color: '#93C5FD', fontSize: '0.8125rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>

      {/* Right — Login Form with Suspense */}
      <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading login form...</div>}>
          <EmployerLoginForm />
        </Suspense>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-brand { display: none !important; }
        }
      `}</style>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  industry: z.string().optional(),
  companyType: z.string().optional(),
  agreeTerms: z.boolean().refine(v => v, 'You must agree to the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function EmployerRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { agreeTerms: false },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(data);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        toast.success('Account created successfully! Welcome aboard.');
        router.push('/employer/company-profile');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = ['Information Technology', 'Banking & Finance', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Education', 'Retail', 'Media & Entertainment', 'Real Estate', 'Other'];
  const companyTypes = ['Private Limited', 'Public Limited', 'Startup', 'Partnership', 'Sole Proprietorship', 'NGO', 'Government', 'Other'];

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">
      {/* Left — Brand Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }} className="auth-brand">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>JobPortal</span>
        </Link>

        <div>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Start Hiring the Best Talent Today
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Join thousands of employers who trust JobPortal to connect them with qualified candidates across India.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              'Post unlimited job listings',
              'Access a pool of active candidates',
              'Manage all applications in one place',
              'Real-time application status updates',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#DBEAFE' }}>
                <CheckCircle size={18} color="#34D399" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div style={{ padding: '3rem 2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Employer Account</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Already have an account?{' '}
              <Link href="/employer/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Company Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Company Name <span className="required">*</span></label>
                <input className={`form-input ${errors.companyName ? 'error' : ''}`} placeholder="Acme Corp" {...register('companyName')} />
                {errors.companyName && <p className="form-error">{errors.companyName.message}</p>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Official Email <span className="required">*</span></label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="hr@company.com" {...register('email')} />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="+91 98765 43210" {...register('phone')} />
              </div>

              {/* Industry & Company Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Industry</label>
                  <select className="form-select" {...register('industry')}>
                    <option value="">Select industry</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Company Type</label>
                  <select className="form-select" {...register('companyType')}>
                    <option value="">Select type</option>
                    {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    {...register('password')}
                    style={{ paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfPw ? 'text' : 'password'}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter your password"
                    {...register('confirmPassword')}
                    style={{ paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowConfPw(!showConfPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showConfPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" {...register('agreeTerms')} style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link href="/privacy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <p className="form-error" style={{ marginTop: '0.375rem' }}>{errors.agreeTerms.message}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
                disabled={isLoading}
              >
                {isLoading ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : null}
                {isLoading ? 'Creating Account...' : 'Create Employer Account'}
              </button>
            </form>
          </motion.div>
        </div>
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

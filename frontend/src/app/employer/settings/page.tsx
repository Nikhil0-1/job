'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { usersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data: PasswordForm) => {
    setSaving(true);
    try {
      await usersAPI.changePassword(data);
      toast.success('Password changed successfully!');
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account security and preferences</p>
      </div>

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.0625rem', margin: 0 }}>Account Information</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>Email Address</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.email}</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>Company</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.companyName || '—'}</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>Account Role</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Employer</div>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={18} color="#D97706" />
            </div>
            <h2 style={{ fontSize: '1.0625rem', margin: 0 }}>Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onChangePassword)} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Current Password <span className="required">*</span></label>
                <input type="password" className={`form-input ${errors.currentPassword ? 'error' : ''}`} placeholder="Your current password" {...register('currentPassword')} />
                {errors.currentPassword && <p className="form-error">{errors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="form-label">New Password <span className="required">*</span></label>
                <input type="password" className={`form-input ${errors.newPassword ? 'error' : ''}`} placeholder="Min 8 chars, 1 uppercase, 1 number" {...register('newPassword')} />
                {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}
              </div>
              <div>
                <label className="form-label">Confirm New Password <span className="required">*</span></label>
                <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter new password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>
              <div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <div className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Key size={16} />}
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: '#D1FAE5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} color="#059669" />
            </div>
            <h2 style={{ fontSize: '1.0625rem', margin: 0 }}>Notification Preferences</h2>
          </div>
          {[
            { label: 'New application received', desc: 'Get notified when a candidate applies to your job', checked: true },
            { label: 'Application status alerts', desc: 'Reminders about pending applications to review', checked: true },
            { label: 'Weekly summary', desc: 'Weekly digest of your hiring activity', checked: false },
          ].map((pref, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 2 ? '1.25rem' : 0, marginBottom: i < 2 ? '1.25rem' : 0, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{pref.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{pref.desc}</div>
              </div>
              <input type="checkbox" defaultChecked={pref.checked} style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }} />
            </div>
          ))}
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '1.75rem', border: '1px solid #FEE2E2' }}>
          <h2 style={{ fontSize: '1.0625rem', color: 'var(--error)', marginBottom: '0.75rem' }}>Danger Zone</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
            Once you delete your account, all your data including jobs and applications will be permanently removed.
          </p>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => toast.error('Account deletion is disabled in demo mode. Contact support to delete your account.')}
          >
            Delete Account
          </button>
        </motion.div>
      </div>
    </div>
  );
}

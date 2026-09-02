'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Save, Building2, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companyAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { ProfileSkeleton } from '@/components/ui/Skeletons';

const schema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  about: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const INDUSTRIES = ['Information Technology', 'Banking & Finance', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Education', 'Retail', 'Media & Entertainment', 'Real Estate', 'Consulting', 'FMCG', 'Logistics', 'Other'];
const COMPANY_SIZES = ['1-10', '10-50', '50-200', '200-500', '500-1000', '1000-5000', '5000+'];

export default function CompanyProfilePage() {
  const { user, updateUser } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    companyAPI.getMyCompany()
      .then(res => {
        const c = res.data.data.company;
        setCompany(c);
        if (c) {
          reset({
            name: c.name || user?.companyName || '',
            about: c.about || '',
            industry: c.industry || '',
            companySize: c.companySize || '',
            website: c.website || '',
            email: c.email || '',
            phone: c.phone || '',
            address: c.address || '',
            city: c.city || '',
            state: c.state || '',
            country: c.country || '',
          });
          setLogoPreview(c.logo || null);
        } else {
          reset({ name: user?.companyName || '', country: 'India' });
        }
      })
      .catch(() => toast.error('Failed to load company profile'))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      let res;
      if (company?.id) {
        res = await companyAPI.updateCompany(company.id, data);
      } else {
        res = await companyAPI.createOrUpdateCompany(data);
      }
      setCompany(res.data.data.company);
      toast.success('Company profile saved successfully!');
      if (!user?.hasCompany) updateUser({ hasCompany: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) {
      if (!company?.id) toast.error('Please save your company profile first before uploading a logo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await companyAPI.uploadLogo(company.id, formData);
      setLogoPreview(res.data.data.logoUrl);
      setCompany((prev: any) => ({ ...prev, logo: res.data.data.logoUrl }));
      toast.success('Company logo uploaded!');
    } catch {
      toast.error('Failed to upload logo');
      setLogoPreview(company?.logo || null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  const initials = (user?.companyName || 'CO').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>Company Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {company ? 'Update your company information' : 'Complete your company profile to start posting jobs'}
        </p>
      </div>

      {!company && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Building2 size={18} color="#D97706" style={{ flexShrink: 0 }} />
          <p style={{ color: '#92400E', fontSize: '0.9375rem', margin: 0 }}>
            Your company profile is incomplete. Complete it to unlock the ability to post jobs.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }} className="profile-grid">
          {/* Logo Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Company Logo</h3>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: 20,
                  background: 'var(--primary-50)',
                  border: '3px dashed var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }} onClick={() => fileInputRef.current?.click()}>
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Company logo" width={100} height={100} style={{ objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--primary)' }}>{initials}</span>
                  )}
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="spinner" style={{ width: 24, height: 24, borderTopColor: 'var(--primary)' }} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: -8, right: -8,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--primary)', border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={14} color="white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                JPG, PNG or WebP<br />Max 2MB · Recommended 200×200px
              </p>
              {!company?.id && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Save profile first to upload logo
                </p>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Basic Info */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Company Name <span className="required">*</span></label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Acme Corp" {...register('name')} />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="form-label">About Company</label>
                  <textarea className="form-textarea" placeholder="Tell candidates about your company, culture, and mission..." rows={4} {...register('about')} style={{ minHeight: 120 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Industry</label>
                    <select className="form-select" {...register('industry')}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Company Size</label>
                    <select className="form-select" {...register('companySize')}>
                      <option value="">Select size</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Contact Information</h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Website</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className={`form-input ${errors.website ? 'error' : ''}`} placeholder="https://yourcompany.com" {...register('website')} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                  {errors.website && <p className="form-error">{errors.website.message}</p>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="info@company.com" {...register('email')} style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type="tel" className="form-input" placeholder="+91 98765 43210" {...register('phone')} style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Location</h3>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
                    <input className="form-input" placeholder="Street address, building, floor..." {...register('address')} style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">City</label>
                    <input className="form-input" placeholder="Mumbai" {...register('city')} />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="Maharashtra" {...register('state')} />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <input className="form-input" placeholder="India" {...register('country')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Save */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Company Profile'}
              </button>
            </div>
          </motion.div>
        </div>
      </form>

      <style jsx global>{`
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

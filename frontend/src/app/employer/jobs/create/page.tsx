'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { jobsAPI, categoriesAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { JobCategory } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  categoryId: z.string().optional(),
  department: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE']),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  salaryPeriod: z.enum(['HOURLY', 'MONTHLY', 'YEARLY']).optional(),
  experience: z.enum(['FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  education: z.string().optional(),
  vacancies: z.number().int().positive().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  deadline: z.string().optional(),
}).refine(d => {
  if (d.minSalary && d.maxSalary) return d.maxSalary >= d.minSalary;
  return true;
}, { message: 'Max salary must be ≥ min salary', path: ['maxSalary'] });

type FormData = z.infer<typeof schema>;

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>{title}</h3>
      <div style={{ display: 'grid', gap: '1.25rem' }}>{children}</div>
    </div>
  );
}

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobType: 'FULL_TIME',
      workMode: 'ONSITE',
      experience: 'MID',
      salaryPeriod: 'YEARLY',
      country: 'India',
      vacancies: 1,
    },
  });

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data.data.categories || [])).catch(() => {});
  }, []);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.companyId) {
      toast.error('Please complete your company profile before posting a job.');
      router.push('/employer/company-profile');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        skills,
        minSalary: data.minSalary ? Number(data.minSalary) : undefined,
        maxSalary: data.maxSalary ? Number(data.maxSalary) : undefined,
        vacancies: data.vacancies ? Number(data.vacancies) : 1,
      };
      const res = await jobsAPI.createJob(payload);
      toast.success('Job published successfully!');
      router.push('/employer/jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelFor = (opts: Record<string, string>, val: string) => opts[val] || val;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/employer/jobs" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Post a New Job</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to publish your job listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }} className="create-job-grid">
          <div>
            {/* Job Info */}
            <FormSection title="Job Information">
              <div>
                <label className="form-label">Job Title <span className="required">*</span></label>
                <input className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Senior Software Developer" {...register('title')} />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('categoryId')}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input className="form-input" placeholder="e.g. Engineering, Sales" {...register('department')} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Job Type <span className="required">*</span></label>
                  <select className={`form-select ${errors.jobType ? 'error' : ''}`} {...register('jobType')}>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Work Mode <span className="required">*</span></label>
                  <select className="form-select" {...register('workMode')}>
                    <option value="ONSITE">On-site</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
            </FormSection>

            {/* Location */}
            <FormSection title="Location">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Country</label>
                  <input className="form-input" placeholder="India" {...register('country')} />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input className="form-input" placeholder="Maharashtra" {...register('state')} />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="Mumbai" {...register('city')} />
                </div>
              </div>
            </FormSection>

            {/* Salary */}
            <FormSection title="Compensation">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Min Salary (₹)</label>
                  <input type="number" className="form-input" placeholder="500000" {...register('minSalary', { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="form-label">Max Salary (₹)</label>
                  <input type="number" className={`form-input ${errors.maxSalary ? 'error' : ''}`} placeholder="1000000" {...register('maxSalary', { valueAsNumber: true })} />
                  {errors.maxSalary && <p className="form-error">{errors.maxSalary.message}</p>}
                </div>
                <div>
                  <label className="form-label">Period</label>
                  <select className="form-select" {...register('salaryPeriod')}>
                    <option value="YEARLY">Per Year</option>
                    <option value="MONTHLY">Per Month</option>
                    <option value="HOURLY">Per Hour</option>
                  </select>
                </div>
              </div>
            </FormSection>

            {/* Requirements */}
            <FormSection title="Requirements">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Experience Level <span className="required">*</span></label>
                  <select className="form-select" {...register('experience')}>
                    <option value="FRESHER">Fresher</option>
                    <option value="JUNIOR">Junior (1-3 yrs)</option>
                    <option value="MID">Mid (3-5 yrs)</option>
                    <option value="SENIOR">Senior (5-8 yrs)</option>
                    <option value="LEAD">Lead (8+ yrs)</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Education</label>
                  <input className="form-input" placeholder="B.Tech, MBA, etc." {...register('education')} />
                </div>
                <div>
                  <label className="form-label">Vacancies</label>
                  <input type="number" min={1} className="form-input" placeholder="1" {...register('vacancies', { valueAsNumber: true })} />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="form-label">Required Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.625rem' }}>
                  {skills.map(skill => (
                    <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.375rem 0.75rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600 }}>
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1, padding: 0 }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    placeholder="Type a skill and press Enter or comma"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => addSkill(skillInput)} className="btn btn-secondary btn-sm">
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <p className="form-hint">Press Enter or comma to add skills</p>
              </div>
            </FormSection>

            {/* Description */}
            <FormSection title="Job Description">
              <div>
                <label className="form-label">Description <span className="required">*</span></label>
                <textarea className={`form-textarea ${errors.description ? 'error' : ''}`} rows={6} placeholder="Describe the role, responsibilities, and what makes this a great opportunity..." {...register('description')} style={{ minHeight: 160 }} />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>
              <div>
                <label className="form-label">Responsibilities</label>
                <textarea className="form-textarea" rows={5} placeholder="• Responsibility 1&#10;• Responsibility 2&#10;• Responsibility 3" {...register('responsibilities')} style={{ minHeight: 120 }} />
              </div>
              <div>
                <label className="form-label">Requirements</label>
                <textarea className="form-textarea" rows={5} placeholder="• Requirement 1&#10;• Requirement 2" {...register('requirements')} style={{ minHeight: 120 }} />
              </div>
              <div>
                <label className="form-label">Benefits</label>
                <textarea className="form-textarea" rows={4} placeholder="• Health insurance&#10;• Flexible work hours&#10;• Annual bonus" {...register('benefits')} style={{ minHeight: 100 }} />
              </div>
            </FormSection>
          </div>

          {/* Sidebar — application settings */}
          <div style={{ position: 'sticky', top: 90 }} className="job-sidebar">
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Application Settings</h3>
              <div>
                <label className="form-label">Application Deadline</label>
                <input type="date" className="form-input" {...register('deadline')} min={new Date().toISOString().split('T')[0]} />
                <p className="form-hint">Leave blank for no deadline</p>
              </div>
            </div>

            {/* Publish button */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : null}
                {isSubmitting ? 'Publishing...' : 'Publish Job'}
              </button>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                Job will be visible to candidates immediately
              </p>
            </div>
          </div>
        </div>
      </form>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .create-job-grid { grid-template-columns: 1fr !important; }
          .job-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}

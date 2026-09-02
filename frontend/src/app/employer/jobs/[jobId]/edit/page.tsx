'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';
import { jobsAPI, categoriesAPI } from '@/lib/api';
import { JobCategory, Job } from '@/types';
import { LoadingPage, ErrorState } from '@/components/ui/Skeletons';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  categoryId: z.string().optional(),
  department: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE']),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
  status: z.enum(['ACTIVE', 'DRAFT', 'CLOSED', 'EXPIRED']),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minSalary: z.number().positive().optional().nullable(),
  maxSalary: z.number().positive().optional().nullable(),
  salaryPeriod: z.enum(['HOURLY', 'MONTHLY', 'YEARLY']).optional(),
  experience: z.enum(['FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  education: z.string().optional(),
  vacancies: z.number().int().positive().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  deadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>{title}</h3>
      <div style={{ display: 'grid', gap: '1.25rem' }}>{children}</div>
    </div>
  );
}

export default function EditJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    Promise.all([
      categoriesAPI.getAll().then(res => setCategories(res.data.data.categories || [])),
      jobsAPI.getJobById(jobId).then(res => {
        const j: Job = res.data.data.job;
        reset({
          title: j.title,
          categoryId: j.categoryId || '',
          department: j.department || '',
          jobType: j.jobType,
          workMode: j.workMode,
          status: j.status,
          country: j.country || '',
          state: j.state || '',
          city: j.city || '',
          minSalary: j.minSalary,
          maxSalary: j.maxSalary,
          salaryPeriod: j.salaryPeriod || 'YEARLY',
          experience: j.experience,
          education: j.education || '',
          vacancies: j.vacancies || 1,
          description: j.description,
          responsibilities: j.responsibilities || '',
          requirements: j.requirements || '',
          benefits: j.benefits || '',
          deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
        });
        setSkills(j.skills || []);
      }),
    ])
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [jobId, reset]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        skills,
        minSalary: data.minSalary ? Number(data.minSalary) : undefined,
        maxSalary: data.maxSalary ? Number(data.maxSalary) : undefined,
        vacancies: data.vacancies ? Number(data.vacancies) : 1,
      };
      await jobsAPI.updateJob(jobId, payload);
      toast.success('Job updated successfully!');
      router.push('/employer/jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorState message="Job not found." onRetry={() => router.push('/employer/jobs')} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/employer/jobs" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Edit Job Listing</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update details for your job posting</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }} className="create-job-grid">
          <div>
            <FormSection title="Job Information">
              <div>
                <label className="form-label">Job Title <span className="required">*</span></label>
                <input className={`form-input ${errors.title ? 'error' : ''}`} {...register('title')} />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('categoryId')}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input className="form-input" {...register('department')} />
                </div>
              </div>
              <div className="grid-3" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Job Type</label>
                  <select className="form-select" {...register('jobType')}>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Work Mode</label>
                  <select className="form-select" {...register('workMode')}>
                    <option value="ONSITE">On-site</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-select" {...register('status')}>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CLOSED">Closed</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Location">
              <div className="grid-3" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Country</label>
                  <input className="form-input" {...register('country')} />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input className="form-input" {...register('state')} />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input className="form-input" {...register('city')} />
                </div>
              </div>
            </FormSection>

            <FormSection title="Compensation & Requirements">
              <div className="grid-3" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Min Salary (₹)</label>
                  <input type="number" className="form-input" {...register('minSalary', { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="form-label">Max Salary (₹)</label>
                  <input type="number" className="form-input" {...register('maxSalary', { valueAsNumber: true })} />
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
              <div>
                <label className="form-label">Experience Level</label>
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
                <label className="form-label">Required Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.625rem' }}>
                  {skills.map(skill => (
                    <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '0.375rem 0.75rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 600 }}>
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-input" placeholder="Add a skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} style={{ flex: 1 }} />
                  <button type="button" onClick={() => addSkill(skillInput)} className="btn btn-secondary btn-sm">
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
            </FormSection>

            <FormSection title="Job Description">
              <div>
                <label className="form-label">Description <span className="required">*</span></label>
                <textarea className={`form-textarea ${errors.description ? 'error' : ''}`} rows={6} {...register('description')} />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>
              <div>
                <label className="form-label">Responsibilities</label>
                <textarea className="form-textarea" rows={4} {...register('responsibilities')} />
              </div>
              <div>
                <label className="form-label">Requirements</label>
                <textarea className="form-textarea" rows={4} {...register('requirements')} />
              </div>
              <div>
                <label className="form-label">Benefits</label>
                <textarea className="form-textarea" rows={4} {...register('benefits')} />
              </div>
            </FormSection>
          </div>

          <div style={{ position: 'sticky', top: 90 }} className="job-sidebar">
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <label className="form-label">Application Deadline</label>
              <input type="date" className="form-input" {...register('deadline')} />
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Save size={18} />}
                {isSubmitting ? 'Saving Changes...' : 'Save Job Changes'}
              </button>
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

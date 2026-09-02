'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/Skeletons';

export default function JobApplicationsRedirectPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (jobId) {
      router.replace(`/employer/applications?jobId=${jobId}`);
    }
  }, [jobId, router]);

  return <LoadingPage />;
}

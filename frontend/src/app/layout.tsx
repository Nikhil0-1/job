import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'JobPortal — Find Opportunities. Hire Great Talent.',
    template: '%s | JobPortal',
  },
  description:
    'Connect talented job seekers with top companies. Post jobs, manage applications, and find your next great hire or career opportunity.',
  keywords: ['jobs', 'hiring', 'recruitment', 'career', 'employer', 'job portal', 'India'],
  authors: [{ name: 'JobPortal' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'JobPortal',
    title: 'JobPortal — Find Opportunities. Hire Great Talent.',
    description: 'Connect talented job seekers with top companies in India.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: '500',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: 'white' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

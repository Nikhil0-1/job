'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            fontSize: '6rem',
            fontWeight: 900,
            color: 'var(--primary)',
            lineHeight: 1,
            marginBottom: '1rem',
            letterSpacing: '-0.04em',
          }}>
            404
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.0625rem', lineHeight: 1.6 }}>
            Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary btn-lg"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

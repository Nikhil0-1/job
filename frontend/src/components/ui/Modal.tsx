'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const maxWidths = { sm: 400, md: 560, lg: 720, xl: 960 };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              maxWidth: maxWidths[size],
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {title && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)',
              }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{title}</h3>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <div style={{ padding: '1.75rem' }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: variant === 'danger' ? '#FEE2E2' : 'var(--primary-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          {variant === 'danger' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64 18.32 1.55 18.68 1.55 19.04C1.55 19.94 2.3 20.68 3.21 20.68H20.78C21.69 20.68 22.44 19.94 22.44 19.04C22.44 18.68 22.35 18.32 22.17 18L13.71 3.86C13.35 3.27 12.7 2.9 12 2.9C11.3 2.9 10.65 3.27 10.29 3.86Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--primary)" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-${variant}`}
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

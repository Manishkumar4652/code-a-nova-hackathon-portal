import React from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const styles = {
  error: { wrapper: 'border-bad/25 bg-bad-soft text-bad', icon: AlertCircle },
  success: { wrapper: 'border-ok/25 bg-ok-soft text-ok', icon: CheckCircle2 },
  warning: { wrapper: 'border-warn/25 bg-warn-soft text-warn', icon: TriangleAlert },
  info: { wrapper: 'border-navy/15 bg-paper-2 text-ink-soft', icon: Info },
};

export default function Alert({ type = 'error', message, onClose, className = '', children }) {
  if (!message) return null;
  const current = styles[type] || styles.error;
  const Icon = current.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-[10px] border p-3.5 text-sm ${current.wrapper} ${className}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <Icon className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" aria-hidden="true" />
      <div className="flex-1 font-medium leading-snug">
        {message}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss message"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

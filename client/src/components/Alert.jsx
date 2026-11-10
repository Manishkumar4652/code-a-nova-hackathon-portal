import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Alert({
  type = 'error',
  message,
  onClose,
  className = '',
}) {
  if (!message) return null;

  const styles = {
    error: {
      wrapper: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
    success: {
      wrapper: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    info: {
      wrapper: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      icon: Info,
      iconColor: 'text-indigo-400',
    },
  };

  const current = styles[type] || styles.error;
  const IconComponent = current.icon;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm backdrop-blur-sm ${current.wrapper} ${className}`}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}


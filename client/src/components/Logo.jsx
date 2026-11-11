import React from 'react';
import { Code2 } from 'lucide-react';

export default function Logo({ tone = 'dark', className = '' }) {
  const isLight = tone === 'light';
  return (
    <div
      className={`inline-flex items-center gap-2.5 font-display font-bold text-xl tracking-tight ${
        isLight ? 'text-surface' : 'text-ink'
      } ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nova-600 text-white shadow-sm">
        <Code2 className="h-5 w-5" />
      </div>
      <span>
        Code<span className="text-nova-600">-a-</span>Nova
      </span>
    </div>
  );
}


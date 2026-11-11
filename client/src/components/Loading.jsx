import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading…', fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-7 w-7', lg: 'h-10 w-10' };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6" role="status">
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-nova-600`} aria-hidden="true" />
      {message && <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }
  return content;
}

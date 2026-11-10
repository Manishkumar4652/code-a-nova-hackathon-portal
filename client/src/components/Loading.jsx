import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({
  message = 'Loading...',
  fullScreen = false,
  size = 'md',
}) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-indigo-400`} />
      {message && <p className="text-sm font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}


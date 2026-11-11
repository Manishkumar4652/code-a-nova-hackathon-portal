import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Create account', 'Verify email', 'Log in'];

export default function AuthShell({ current = 0, title, subtitle, footer, children }) {
  return (
    <div className="container-page py-12 sm:py-20">
      <div className="mx-auto max-w-lg">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
          {STEPS.map((step, idx) => {
            const isDone = idx < current;
            const isCurrent = idx === current;
            return (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isDone
                      ? 'bg-ok text-white'
                      : isCurrent
                      ? 'bg-nova-600 text-white'
                      : 'border border-line bg-paper-2 text-ink-muted'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? 'font-semibold text-ink' : 'text-ink-muted'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-8">
          {title && <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {/* Footer */}
        {footer && <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>}
      </div>
    </div>
  );
}


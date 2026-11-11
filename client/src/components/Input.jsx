import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const controlBase =
  'w-full rounded-[10px] border bg-surface text-sm text-ink placeholder:text-ink-muted/70 ' +
  'transition-all duration-200 ease-out focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-paper-2 disabled:text-ink-muted';

const controlState = (error) =>
  error
    ? 'border-bad focus:border-bad focus:ring-bad/15'
    : 'border-line-strong hover:border-ink-muted focus:border-nova-600 focus:ring-nova-600/15';

/** Label + control + hint/error wrapper shared by every form control. */
function Field({ id, label, optional, error, helperText, children }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="flex items-baseline justify-between text-[13px] font-semibold text-ink">
          <span>{label}</span>
          {optional && <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink-muted">Optional</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-bad">
          {error}
        </p>
      ) : (
        helperText && (
          <p id={`${id}-hint`} className="text-xs text-ink-muted">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

const Input = forwardRef(
  ({ label, optional, error, helperText, icon: Icon, type = 'text', className = '', id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || props.name || autoId;
    return (
      <Field id={inputId} label={label} optional={optional} error={error} helperText={helperText}>
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
            className={`${controlBase} ${controlState(error)} py-2.5 pr-3.5 ${Icon ? 'pl-10' : 'pl-3.5'} ${className}`}
            {...props}
          />
        </div>
      </Field>
    );
  }
);
Input.displayName = 'Input';

export const Select = forwardRef(
  ({ label, optional, error, helperText, options = [], placeholder, className = '', id, ...props }, ref) => {
    const autoId = useId();
    const selectId = id || props.name || autoId;
    return (
      <Field id={selectId} label={label} optional={optional} error={error} helperText={helperText}>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={`${controlBase} ${controlState(error)} appearance-none py-2.5 pl-3.5 pr-10 ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        </div>
      </Field>
    );
  }
);
Select.displayName = 'Select';

export const Textarea = forwardRef(
  ({ label, optional, error, helperText, className = '', id, rows = 5, ...props }, ref) => {
    const autoId = useId();
    const areaId = id || props.name || autoId;
    return (
      <Field id={areaId} label={label} optional={optional} error={error} helperText={helperText}>
        <textarea
          id={areaId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={`${controlBase} ${controlState(error)} resize-y p-3.5 ${className}`}
          {...props}
        />
      </Field>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;

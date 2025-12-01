'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { UseFormRegister } from 'react-hook-form';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  labelClassName?: string;
  errorMessage?: string;
  register?: UseFormRegister<any>;
  name?: string;
}

export function Textarea({
  className,
  label,
  labelClassName,
  errorMessage,
  register,
  name,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || React.useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-foreground',
            errorMessage && 'text-destructive',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-card flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          errorMessage && 'aria-invalid:border-destructive',
          className
        )}
        aria-invalid={!!errorMessage}
        {...(register && name ? register(name) : {})}
        {...props}
      />
      {errorMessage && (
        <span className="text-xs text-destructive mt-1">{errorMessage}</span>
      )}
    </div>
  );
}
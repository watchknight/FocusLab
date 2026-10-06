import React from 'react';
import clsx from 'clsx';

// Shared focus ring and input target classes
export const FOCUS_RING_CLASSES =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export const INPUT_BASE_CLASSES =
  'min-h-[44px] rounded-xs border border-border-strong bg-surface text-text px-3 py-2 text-sm transition-colors ' +
  FOCUS_RING_CLASSES;

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;
    return (
      <label
        htmlFor={inputId}
        className="min-h-[44px] inline-flex items-center gap-3 cursor-pointer select-none text-text text-sm font-medium"
      >
        <span className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={clsx(
              'w-5 h-5 rounded-xs border border-border-strong bg-surface checked:bg-accent checked:border-accent-edge cursor-pointer transition-colors accent-accent',
              FOCUS_RING_CLASSES,
              className
            )}
            {...props}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;
    return (
      <label
        htmlFor={inputId}
        className="min-h-[44px] inline-flex items-center gap-3 cursor-pointer select-none text-text text-sm font-medium"
      >
        <span className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className={clsx(
              'w-5 h-5 rounded-full border border-border-strong bg-surface checked:bg-accent checked:border-accent-edge cursor-pointer transition-colors accent-accent',
              FOCUS_RING_CLASSES,
              className
            )}
            {...props}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Radio.displayName = 'Radio';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, id, children, ...props }, ref) => {
    const fallbackId = React.useId();
    const selectId = id || fallbackId;
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            INPUT_BASE_CLASSES,
            'cursor-pointer bg-surface-2 pr-8',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  valueDisplay?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ label, valueDisplay, className, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const sliderId = id || fallbackId;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {(label || valueDisplay) && (
          <div className="flex justify-between items-center text-sm font-medium text-text">
            {label && <label htmlFor={sliderId}>{label}</label>}
            {valueDisplay && <span className="tabular-nums text-muted">{valueDisplay}</span>}
          </div>
        )}
        <div className="min-h-[44px] flex items-center w-full">
          <input
            ref={ref}
            id={sliderId}
            type="range"
            className={clsx(
              'w-full h-2 bg-surface-2 rounded-xs appearance-none cursor-pointer accent-accent',
              FOCUS_RING_CLASSES,
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, className, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="number"
          className={clsx(INPUT_BASE_CLASSES, 'tabular-nums', className)}
          {...props}
        />
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className, id, ...props }, ref) => {
    const fallbackId = React.useId();
    const inputId = id || fallbackId;
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          className={clsx(INPUT_BASE_CLASSES, className)}
          {...props}
        />
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

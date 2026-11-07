import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";

/** Shared, fixed-theme form pieces for the setup wizard (matches the auth pages). */

export const controlClass =
  "h-12 w-full rounded-xl border-2 border-[#10231D]/15 bg-white px-4 text-base text-[#10231D] outline-none transition-[border-color,box-shadow] placeholder:text-[#10231D]/35 hover:border-[#10231D]/30 focus:border-[#1B4D3E] focus:shadow-[0_0_0_4px_rgba(27,77,62,0.16)] disabled:cursor-not-allowed disabled:opacity-50";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, optional, htmlFor, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
        {label}
        {optional && <span className="text-sm font-normal text-[#10231D]/55">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-[#10231D]/60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-[#B02F22]">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function SelectField({ label, hint, className = "", children, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <div className="relative">
        <select id={id} className={`${controlClass} appearance-none pr-11`} {...rest}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#10231D]/55" />
      </div>
    </Field>
  );
}

/** Square tick box used inside selectable cards (the card itself is the button). */
export function TickBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
        checked ? "border-[#1B4D3E] bg-[#1B4D3E] text-[#F6F3EA]" : "border-[#10231D]/25 bg-white"
      }`}
    >
      {checked && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

/** Accessible on/off switch. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E] ${
        checked ? "bg-[#1B4D3E]" : "bg-[#10231D]/25"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-[left] duration-150 ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

interface NumberStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
  disabled?: boolean;
}

/** Number input with big − / + buttons, easier than a tiny spinner. */
export function NumberStepper({ value, onChange, min = 0, max = 10000, label, disabled }: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const btn =
    "grid h-10 w-10 place-items-center rounded-lg bg-[#10231D]/8 text-[#10231D] transition-colors hover:bg-[#10231D]/15 disabled:opacity-40 disabled:hover:bg-[#10231D]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E]";
  return (
    <div className="inline-flex items-center gap-1.5">
      <button type="button" aria-label={`Decrease ${label}`} disabled={disabled || value <= min} onClick={() => onChange(clamp(value - 1))} className={btn}>
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || min))}
        className="h-10 w-16 rounded-lg border-2 border-[#10231D]/15 bg-white text-center text-base font-semibold text-[#10231D] outline-none focus:border-[#1B4D3E] disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" aria-label={`Increase ${label}`} disabled={disabled || value >= max} onClick={() => onChange(clamp(value + 1))} className={btn}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

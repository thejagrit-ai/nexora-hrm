import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  type?: "text" | "email" | "password";
  /** Sits opposite the label (e.g. "Forgot password?"). */
  labelAction?: ReactNode;
}

/** Fixed-theme form field shared by login and register. Password type gets its own show/hide control. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, type = "text", labelAction, className = "", id, ...rest }, ref) => {
    const auto = useId();
    const inputId = id ?? auto;
    const [shown, setShown] = useState(false);
    const isPassword = type === "password";

    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor={inputId} className="text-[15px] font-semibold">
            {label}
          </label>
          {labelAction}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && shown ? "text" : type}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : undefined}
            className={`h-14 w-full rounded-xl border-2 bg-white px-4 text-base text-[#10231D] outline-none transition-[border-color,box-shadow] placeholder:text-[#10231D]/35 focus:border-[#1B4D3E] focus:shadow-[0_0_0_4px_rgba(27,77,62,0.16)] ${
              error ? "border-[#C0392B]" : "border-[#10231D]/15 hover:border-[#10231D]/30"
            } ${isPassword ? "pr-14" : ""} ${className}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShown((v) => !v)}
              aria-label={shown ? "Hide password" : "Show password"}
              aria-pressed={shown}
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-[#10231D]/55 hover:text-[#10231D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E]"
            >
              {shown ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-err`} className="mt-2 text-sm font-medium text-[#B02F22]">
            {error}
          </p>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";

export const SubmitButton = ({ busy, children }: { busy: boolean; children: ReactNode }) => (
  <button
    type="submit"
    disabled={busy}
    className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#F4B63F] px-5 text-base font-bold text-[#10231D] transition-[background-color,transform] hover:bg-[#EAA724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10231D] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
  >
    {children}
  </button>
);

import { Check } from "lucide-react";

const RULES = [
  { label: "8+ characters", short: "8+ chars", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", short: "Upper", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", short: "Lower", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", short: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "A symbol", short: "Symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = ["Too weak", "Weak", "Fair", "Good", "Strong", "Strong"];
const COLORS = ["#C0392B", "#C0392B", "#D9922B", "#7A9A2E", "#2E9E6B", "#2E9E6B"];

/**
 * Fixed-theme password checklist. The rules are visible before typing.
 * `compact` renders the rules as one row of chips so a long form fits one screen.
 */
export default function PasswordStrength({ password, compact = false }: { password: string; compact?: boolean }) {
  const results = RULES.map((r) => r.test(password ?? ""));
  const met = results.filter(Boolean).length;
  const color = COLORS[met];
  const meter = (
    <div className="flex flex-1 gap-1.5" aria-hidden="true">
      {RULES.map((_, i) => (
        <span
          key={i}
          className="h-1.5 flex-1 rounded-full transition-colors duration-200"
          style={{ backgroundColor: i < met ? color : "rgba(16,35,29,0.12)" }}
        />
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className="mt-2.5" aria-live="polite">
        <div className="flex items-center gap-3">
          {meter}
          <span className="w-16 text-right text-sm font-semibold" style={{ color: password ? color : "rgba(16,35,29,0.6)" }}>
            {password ? LEVELS[met] : ""}
          </span>
        </div>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {RULES.map((r, i) => (
            <li
              key={r.label}
              title={r.label}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                results[i] ? "bg-[#D5ECDF] text-[#1B6B48]" : "bg-[#10231D]/8 text-[#10231D]/65"
              }`}
            >
              {results[i] && <Check className="h-3 w-3" strokeWidth={3} />}
              {r.short}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-3" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {RULES.map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-200"
            style={{ backgroundColor: i < met ? color : "rgba(16,35,29,0.12)" }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-semibold" style={{ color: password ? color : "rgba(16,35,29,0.6)" }}>
        {password ? LEVELS[met] : "Password needs:"}
      </p>
      <ul className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
        {RULES.map((r, i) => (
          <li
            key={r.label}
            className={`flex items-center gap-2 text-sm transition-colors ${results[i] ? "text-[#1B6B48]" : "text-[#10231D]/60"}`}
          >
            <span
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                results[i] ? "bg-[#2E9E6B] text-white" : "bg-[#10231D]/10 text-transparent"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

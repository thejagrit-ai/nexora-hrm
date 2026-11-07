import { Check } from "lucide-react";

const RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
  { label: "A symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = ["Too weak", "Weak", "Fair", "Good", "Strong", "Strong"];
const COLORS = ["#C0392B", "#C0392B", "#D9922B", "#7A9A2E", "#2E9E6B", "#2E9E6B"];

/** Fixed-theme password checklist. Always visible so the rules are known before typing. */
export default function PasswordStrength({ password }: { password: string }) {
  const results = RULES.map((r) => r.test(password ?? ""));
  const met = results.filter(Boolean).length;
  const color = COLORS[met];

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

import { useEffect, useRef, useState } from "react";

export type BadgeStatus = "idle" | "verifying" | "granted" | "denied";

interface BadgeProps {
  /** Full name shown on the badge. Empty shows the placeholder. */
  name: string;
  /** Line under the name (email, or role at company). */
  subline: string;
  placeholderName?: string;
  placeholderSubline?: string;
  passwordLength: number;
  status: BadgeStatus;
  labels?: Partial<Record<BadgeStatus, string>>;
}

const DEFAULT_LABELS: Record<BadgeStatus, string> = {
  idle: "Ready to check in",
  verifying: "Checking you in…",
  granted: "Checked in",
  denied: "Not recognised",
};

const TONE: Record<BadgeStatus, string> = {
  idle: "bg-[#10231D] text-[#F6F3EA]",
  verifying: "bg-[#10231D] text-[#F6F3EA] animate-pulse",
  granted: "bg-[#2E9E6B] text-white",
  denied: "bg-[#C0392B] text-white",
};

export function titleCase(raw: string) {
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const words = local.replace(/[0-9]+/g, " ").split(/[._\-\s]+/).filter(Boolean).slice(0, 2);
  return titleCase(words.join(" "));
}

const BARS = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2, 4, 1, 2, 1];
const DISPLAY = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export default function LoginBadge({
  name,
  subline,
  placeholderName = "Your name",
  placeholderSubline = "you@company.com",
  passwordLength,
  status,
  labels,
}: BadgeProps) {
  const card = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?";
  const lit = Math.min(passwordLength, BARS.length);
  const label = { ...DEFAULT_LABELS, ...labels }[status];

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const move = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
  };
  const leave = () => {
    if (card.current) card.current.style.transform = "";
  };

  return (
    <div className="badge-swing flex flex-col items-center" style={{ perspective: 1200 }} onPointerMove={move} onPointerLeave={leave}>
      {/* lanyard runs off the top of the screen */}
      <div className="h-[clamp(56px,14vh,130px)] w-4 bg-[#F4B63F]" aria-hidden="true" />
      <div className="-mt-px h-5 w-14 rounded-b-md bg-[#0B1A15]" aria-hidden="true" />

      <div
        ref={card}
        key={status === "denied" ? "denied" : "ok"}
        className={`relative w-[360px] rounded-[28px] bg-[#F6F3EA] p-7 text-[#10231D] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] transition-transform duration-200 ease-out ${
          status === "denied" ? "badge-shake" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="mb-7 h-2.5 w-16 rounded-full bg-[#10231D]/15" aria-hidden="true" />

        <div className="flex items-center gap-5">
          <div
            className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-2xl bg-[#1B4D3E] text-3xl font-extrabold text-[#F4B63F]"
            style={DISPLAY}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p
              className={`break-words text-2xl font-extrabold leading-[1.05] ${name ? "" : "text-[#10231D]/35"}`}
              style={DISPLAY}
            >
              {name || placeholderName}
            </p>
            <p className={`mt-1 break-all text-sm ${subline ? "text-[#10231D]/70" : "text-[#10231D]/35"}`}>
              {subline || placeholderSubline}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between rounded-2xl bg-[#E9E5D8] px-5 py-4">
          <div>
            <p className="text-sm text-[#10231D]/65">Today</p>
            <p className="text-base font-semibold">
              {now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </p>
          </div>
          <p className="text-5xl font-extrabold leading-none tabular-nums" style={DISPLAY}>
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </p>
        </div>

        {/* barcode: one bar fills per password character */}
        <div className="mt-6 flex h-14 items-stretch gap-[4px]" aria-hidden="true">
          {BARS.map((w, i) => (
            <span
              key={i}
              className={`rounded-[1px] transition-colors duration-150 ${i < lit ? "bg-[#10231D]" : "bg-[#10231D]/20"}`}
              style={{ width: w * 3.4 }}
            />
          ))}
        </div>

        <div
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-full px-5 py-3 text-center text-base font-semibold transition-colors duration-300 ${TONE[status]}`}
        >
          {label}
        </div>
      </div>

      <style>{`
        .badge-swing { transform-origin: 50% 0; animation: badge-swing 2.6s cubic-bezier(.22,.9,.3,1) both; }
        @keyframes badge-swing {
          0% { transform: rotate(7deg) }
          25% { transform: rotate(-4.5deg) }
          50% { transform: rotate(2.4deg) }
          75% { transform: rotate(-1deg) }
          100% { transform: rotate(0) }
        }
        .badge-shake { animation: badge-shake .45s ease-in-out }
        @keyframes badge-shake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-12px) rotate(-1.5deg) }
          45% { transform: translateX(10px) rotate(1.2deg) }
          70% { transform: translateX(-5px) }
        }
        @media (prefers-reduced-motion: reduce) {
          .badge-swing, .badge-shake, .animate-pulse { animation: none }
        }
      `}</style>
    </div>
  );
}

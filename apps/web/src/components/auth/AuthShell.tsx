import type { ReactNode } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NexoraLogo from "@/components/brand/NexoraLogo";

export const DISPLAY = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;


interface AuthShellProps {
  headline: string;
  badge: ReactNode;
  children: ReactNode;
  /** Form column width in px. */
  width?: number;
  /** Tighter vertical padding so a long form fits one screen. */
  dense?: boolean;
}

/** Shared frame for login and register: fixed light theme, sticky badge panel, form column. */
export default function AuthShell({ headline, badge, children, width = 420, dense = false }: AuthShellProps) {
  return (
    <div
      className="nx-auth min-h-dvh w-full bg-[#EEF1EC] text-[#10231D] lg:grid lg:grid-cols-[1fr_1fr]"
      style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif", colorScheme: "light" }}
    >
      {/* Browsers repaint autofilled inputs (dark navy in dark OS themes). Keep them white. */}
      <style>{`
        html .nx-auth input:-webkit-autofill, html .nx-auth input:-webkit-autofill:hover, html .nx-auth input:-webkit-autofill:focus, html .nx-auth input:-webkit-autofill:active, html.dark .nx-auth input:-webkit-autofill, html.dark .nx-auth input:-webkit-autofill:hover, html.dark .nx-auth input:-webkit-autofill:focus, html.dark .nx-auth input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #10231D !important;
          caret-color: #10231D;
          transition: background-color 9999s ease-out 0s;
        }
      `}</style>
      <aside className="relative hidden h-dvh flex-col justify-between overflow-hidden bg-[#1B4D3E] px-14 py-12 lg:sticky lg:top-0 lg:flex">
        <div className="absolute inset-x-0 top-0 flex justify-center" aria-hidden={false}>
          {badge}
        </div>
        <NexoraLogo tone="light" size={48} className="relative" />
        <p
          className="relative max-w-[15ch] text-[clamp(34px,min(4.4vw,7vh),64px)] font-extrabold leading-[1] tracking-[-0.03em] text-[#F6F3EA]"
          style={DISPLAY}
        >
          {headline}
        </p>
      </aside>

      <main className={`flex min-h-dvh flex-col px-6 sm:px-12 lg:px-16 ${dense ? "py-3" : "py-6"}`}>
        <div className="flex items-center justify-between">
          <NexoraLogo tone="dark" size={40} className="lg:invisible" />
          <LanguageSwitcher />
        </div>
        <div className={`mx-auto my-auto w-full ${dense ? "py-2" : "py-10"}`} style={{ maxWidth: width }}>
          {children}
        </div>
      </main>
    </div>
  );
}

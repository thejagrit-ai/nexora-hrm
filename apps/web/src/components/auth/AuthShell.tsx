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
}

/** Shared frame for login and register: fixed light theme, sticky badge panel, form column. */
export default function AuthShell({ headline, badge, children, width = 420 }: AuthShellProps) {
  return (
    <div
      className="min-h-dvh w-full bg-[#EEF1EC] text-[#10231D] lg:grid lg:grid-cols-[1fr_1fr]"
      style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
    >
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

      <main className="flex min-h-dvh flex-col px-6 py-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <NexoraLogo tone="dark" size={40} className="lg:invisible" />
          <LanguageSwitcher />
        </div>
        <div className="mx-auto my-auto w-full py-10" style={{ maxWidth: width }}>
          {children}
        </div>
      </main>
    </div>
  );
}

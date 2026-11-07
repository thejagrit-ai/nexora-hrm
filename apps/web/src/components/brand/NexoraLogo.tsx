interface MarkProps {
  size?: number;
  className?: string;
}

/**
 * The Nexora HR mark: an employee ID badge (marigold card, lanyard slot)
 * carrying a heavy N. Pure vector, no font dependency, so it renders the same
 * in the app, the favicon and exported documents.
 */
export function NexoraMark({ size = 40, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Nexora HR"
      className={className}
    >
      <rect x="5" y="3" width="38" height="42" rx="11" fill="#F4B63F" />
      <rect x="18" y="8.5" width="12" height="3.6" rx="1.8" fill="#10231D" opacity="0.9" />
      <path
        d="M16.5 36V19.5L31.5 36V19.5"
        fill="none"
        stroke="#10231D"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  /** "light" = cream wordmark for dark backgrounds, "dark" = ink wordmark. */
  tone?: "light" | "dark";
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function NexoraLogo({ tone = "dark", size = 40, showWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <NexoraMark size={size} />
      {showWordmark && (
        <span
          className={`font-extrabold leading-none tracking-[-0.02em] ${tone === "light" ? "text-[#F6F3EA]" : "text-[#10231D]"}`}
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: size * 0.6 }}
        >
          Nexora HR
        </span>
      )}
    </span>
  );
}

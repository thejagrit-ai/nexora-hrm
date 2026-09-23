import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  linkTo?: string;
  loading?: boolean;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "bg-indigo-50 dark:bg-indigo-950/50",
  iconColor = "text-indigo-600 dark:text-indigo-400",
  trend,
  trendType = "positive",
  linkTo,
  loading = false,
}: KpiCardProps) {
  const content = (
    <div className="group relative overflow-hidden bg-card rounded-xl border border-border/70 dark:border-border/50 p-4 h-[116px] flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-sm transition-all duration-200">
      {/* Top Row: Title Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
          {title}
        </span>
        <div
          className={`h-8 w-8 rounded-lg ${iconBgColor} ${iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}
        >
          {icon}
        </div>
      </div>

      {/* Middle Row: Large Value Number */}
      <div>
        {loading ? (
          <div className="h-7 w-20 bg-muted animate-pulse rounded-md" />
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground tabular-nums tracking-tight leading-none">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-muted-foreground font-medium truncate">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: Trend Badge */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium h-4 leading-none">
        {trend && !loading && (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              trendType === "positive"
                ? "text-emerald-600 dark:text-emerald-400"
                : trendType === "negative"
                ? "text-rose-600 dark:text-rose-400"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                trendType === "positive"
                  ? "bg-emerald-500"
                  : trendType === "negative"
                  ? "bg-rose-500"
                  : "bg-muted-foreground"
              }`}
            />
            {trend}
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {children}
    </div>
  );
}

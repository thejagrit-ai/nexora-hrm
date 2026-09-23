import { PartyPopper, Cake } from "lucide-react";

interface CelebrationItem {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  years_completed?: number;
}

interface UpcomingEventsProps {
  birthdays?: CelebrationItem[];
  anniversaries?: CelebrationItem[];
  loading?: boolean;
}

export function UpcomingEvents({
  birthdays = [],
  anniversaries = [],
  loading = false,
}: UpcomingEventsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
        <PartyPopper className="h-4 w-4 text-pink-600" />
        Upcoming Celebrations
      </h2>

      {loading ? (
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5 text-amber-500" /> Birthdays This Month
            </h3>
            {birthdays.length > 0 ? (
              <div className="space-y-1.5">
                {birthdays.slice(0, 3).map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="font-medium text-foreground">{b.first_name} {b.last_name}</span>
                    <span className="text-muted-foreground text-[11px]">{b.date_of_birth?.slice(5) || "Upcoming"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No upcoming birthdays</p>
            )}
          </div>

          <div className="pt-2 border-t border-border/60">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
              <PartyPopper className="h-3.5 w-3.5 text-indigo-500" /> Work Anniversaries
            </h3>
            {anniversaries.length > 0 ? (
              <div className="space-y-1.5">
                {anniversaries.slice(0, 3).map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="font-medium text-foreground">{a.first_name} {a.last_name}</span>
                    <span className="text-muted-foreground text-[11px]">{a.years_completed || 1} yr(s)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No work anniversaries this month</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

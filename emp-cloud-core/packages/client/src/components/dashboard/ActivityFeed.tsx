import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

interface AuditLog {
  id: number;
  action: string;
  user_email?: string;
  created_at: string;
}

interface ActivityFeedProps {
  logs?: AuditLog[];
  loading?: boolean;
}

export function ActivityFeed({ logs = [], loading = false }: ActivityFeedProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          Recent HR Activity
        </h2>
        <Link to="/audit-logs" className="text-xs text-muted-foreground hover:text-foreground">
          Audit Logs
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-8 bg-muted animate-pulse rounded" />
        </div>
      ) : logs.length > 0 ? (
        <div className="space-y-3">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{log.action || "System Event"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {log.user_email || "System"} • {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No recent activity recorded
        </div>
      )}
    </div>
  );
}

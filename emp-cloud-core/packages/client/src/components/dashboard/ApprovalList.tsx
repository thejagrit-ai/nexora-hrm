import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaveRequest {
  id: number;
  employee_name?: string;
  leave_type?: string;
  start_date: string;
  end_date?: string;
  days?: number;
  reason?: string;
}

interface ApprovalListProps {
  pendingRequests: LeaveRequest[];
  loading?: boolean;
}

export function ApprovalList({ pendingRequests = [], loading = false }: ApprovalListProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
            Pending Approvals
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Leave and time-off requests requiring review</p>
        </div>
        <Link
          to="/leave/requests"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="divide-y divide-border/60">
          {pendingRequests.slice(0, 4).map((req) => (
            <div key={req.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 font-bold text-xs flex items-center justify-center">
                  {req.employee_name?.charAt(0) || "E"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{req.employee_name || "Employee"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {req.leave_type || "Leave"} • {req.days || 1} day(s) ({req.start_date})
                  </p>
                </div>
              </div>
              <Link
                to="/leave/requests"
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-muted/20 rounded-lg border border-dashed border-border/60">
          <ShieldCheck className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-medium">All leave requests are up to date</p>
        </div>
      )}
    </div>
  );
}

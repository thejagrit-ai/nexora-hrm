import { UserPlus, Briefcase, CalendarDays, CreditCard, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  userRole?: string;
}

export function QuickActions({ userRole = "employee" }: QuickActionsProps) {
  const isAdmin = ["super_admin", "org_admin", "hr_admin"].includes(userRole);

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Quick Actions
        </h2>
        <span className="text-xs text-muted-foreground">Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {isAdmin && (
          <Link
            to="/employees"
            className="p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-indigo-500/30 transition-all flex flex-col items-center text-center gap-1.5"
          >
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <UserPlus className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">Add Employee</span>
          </Link>
        )}

        <Link
          to="/leave/requests"
          className="p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-purple-500/30 transition-all flex flex-col items-center text-center gap-1.5"
        >
          <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-foreground">Request Leave</span>
        </Link>

        {isAdmin && (
          <Link
            to="/recruitment/jobs"
            className="p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-amber-500/30 transition-all flex flex-col items-center text-center gap-1.5"
          >
            <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">Create Job</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/payroll/runs"
            className="p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-indigo-500/30 transition-all flex flex-col items-center text-center gap-1.5"
          >
            <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">Payroll Run</span>
          </Link>
        )}

        <Link
          to="/documents"
          className="p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-emerald-500/30 transition-all flex flex-col items-center text-center gap-1.5"
        >
          <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-foreground">Documents</span>
        </Link>
      </div>
    </div>
  );
}

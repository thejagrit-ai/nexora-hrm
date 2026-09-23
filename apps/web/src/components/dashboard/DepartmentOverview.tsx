import { Building2, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Department {
  id: number;
  name: string;
  code?: string;
  employee_count?: number;
}

interface DepartmentOverviewProps {
  departments: Department[];
  loading?: boolean;
}

export function DepartmentOverview({ departments = [], loading = false }: DepartmentOverviewProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            Departments & Structure
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Headcount distribution across organization</p>
        </div>
        <Link
          to="/employees"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : departments.length > 0 ? (
        <div className="space-y-2">
          {departments.slice(0, 5).map((dept) => (
            <div
              key={dept.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{dept.name}</p>
                  {dept.code && <p className="text-[10px] text-muted-foreground">{dept.code}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Users className="h-3.5 w-3.5" />
                <span>{dept.employee_count ?? 1}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No departments configured yet
        </div>
      )}
    </div>
  );
}

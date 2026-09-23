import { Briefcase, ArrowRight, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface Job {
  id: number;
  title: string;
  department?: string;
  location?: string;
  status: string;
  applicant_count?: number;
}

interface HiringOverviewProps {
  jobs: Job[];
  loading?: boolean;
}

export function HiringOverview({ jobs = [], loading = false }: HiringOverviewProps) {
  const activeJobs = jobs.filter((j) => j.status === "published" || j.status === "open");

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-amber-600" />
            Hiring & Recruitment Funnel
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Active requisitions and applicant pipeline</p>
        </div>
        <Link
          to="/recruitment"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          ATS Workspace <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      ) : activeJobs.length > 0 ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {activeJobs.slice(0, 4).map((job) => (
              <Link
                key={job.id}
                to="/recruitment/jobs"
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{job.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {job.department || "General"} • {job.location || "Remote"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{job.applicant_count ?? 0} applicants</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center bg-muted/20 rounded-lg border border-dashed border-border/60">
          <Briefcase className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-medium">No open hiring requisitions active</p>
          <Link
            to="/recruitment/jobs"
            className="inline-block text-xs font-semibold text-indigo-600 hover:underline mt-1"
          >
            Create a Job Opening
          </Link>
        </div>
      )}
    </div>
  );
}

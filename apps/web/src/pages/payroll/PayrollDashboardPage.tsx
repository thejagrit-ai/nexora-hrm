import { useState, useEffect } from "react";
import { payrollGet } from "@/api/payroll-client";
import {
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PayrollDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMonthlyPayroll: 0,
    activeProfiles: 0,
    payrollRunsCount: 0,
    pendingApprovals: 0,
  });
  const [recentRuns, setRecentRuns] = useState<any[]>([]);

  useEffect(() => {
    async function loadPayrollData() {
      setLoading(true);
      try {
        const [profilesRes, runsRes] = await Promise.allSettled([
          payrollGet("/employees"),
          payrollGet("/payroll-runs"),
        ]);

        const profiles = profilesRes.status === "fulfilled" ? (profilesRes.value?.data || profilesRes.value || []) : [];
        const runs = runsRes.status === "fulfilled" ? (runsRes.value?.data || runsRes.value || []) : [];

        let totalSalary = 0;
        if (Array.isArray(profiles)) {
          totalSalary = profiles.reduce((sum: number, p: any) => sum + Number(p.base_salary || p.salary || 0), 0);
        }

        setStats({
          totalMonthlyPayroll: totalSalary,
          activeProfiles: Array.isArray(profiles) ? profiles.length : 0,
          payrollRunsCount: Array.isArray(runs) ? runs.length : 0,
          pendingApprovals: Array.isArray(runs) ? runs.filter((r: any) => r.status === "draft" || r.status === "processing").length : 0,
        });

        setRecentRuns(Array.isArray(runs) ? runs.slice(0, 5) : []);
      } catch (err) {
        console.warn("Failed to load payroll metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayrollData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Compensation & Payroll Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Process payroll runs, manage salary structures, tax compliance, and payslips in NEXORA HR.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/payroll/runs"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Process Payroll Run
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Monthly Payroll</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">
              {loading ? "..." : `$${stats.totalMonthlyPayroll.toLocaleString()}`}
            </span>
            <span className="text-xs text-emerald-600 font-medium ml-2 inline-flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Calculated
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary Profiles</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.activeProfiles}</span>
            <span className="text-xs text-muted-foreground ml-2">Active Employees</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payroll Runs</span>
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.payrollRunsCount}</span>
            <span className="text-xs text-muted-foreground ml-2">Historical Runs</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Approvals</span>
            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.pendingApprovals}</span>
            <span className="text-xs text-amber-600 font-medium ml-2">Awaiting Final Run</span>
          </div>
        </div>
      </div>

      {/* Main Content Card: Recent Payroll Runs */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Recent Payroll Processing Runs</h2>
          <Link to="/payroll/runs" className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
            View All Runs <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/40 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentRuns.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground font-medium">No payroll runs recorded yet.</p>
            <Link to="/payroll/runs" className="text-xs text-brand-600 hover:underline mt-1 inline-block">Create first payroll run</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentRuns.map((run) => (
              <div key={run.id} className="py-3.5 flex items-center justify-between hover:bg-muted/30 px-2 rounded-lg transition-colors">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{run.name || `Payroll Run — ${run.month}/${run.year}`}</h3>
                  <p className="text-xs text-muted-foreground">Period: {run.period_start} to {run.period_end}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">${Number(run.total_gross || 0).toLocaleString()}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    run.status === "completed" || run.status === "paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  }`}>
                    {run.status || "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

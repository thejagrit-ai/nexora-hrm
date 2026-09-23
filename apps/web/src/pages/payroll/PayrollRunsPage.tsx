import { useState, useEffect } from "react";
import { payrollGet, payrollPost } from "@/api/payroll-client";
import { CreditCard, Play } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export default function PayrollRunsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  async function loadRuns() {
    setLoading(true);
    try {
      const res = await payrollGet("/payroll-runs");
      const list = Array.isArray(res) ? res : (res?.data || []);
      setRuns(list);
    } catch (err) {
      console.warn("Failed to load payroll runs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRuns();
  }, []);

  const handleStartRun = async () => {
    setProcessing(true);
    try {
      const now = new Date();
      await payrollPost("/payroll-runs", {
        name: `Payroll Run — ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        period_start: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`,
        period_end: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-28`,
        pay_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-30`,
      });
      showToast("success", "Payroll run initialized successfully");
      loadRuns();
    } catch (err: any) {
      showToast("error", err.response?.data?.error?.message || "Failed to start payroll run");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Payroll Processing Runs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Execute monthly payroll calculations, review breakdown, and generate payslips.
          </p>
        </div>
        <button
          onClick={handleStartRun}
          disabled={processing}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Play className="h-4 w-4" /> {processing ? "Processing..." : "Process New Payroll Run"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/40 rounded animate-pulse" />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No payroll runs found.</p>
            <button
              onClick={handleStartRun}
              className="mt-3 text-xs text-brand-600 hover:underline font-medium"
            >
              Start monthly payroll run
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {runs.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{r.name || `Payroll Run ${r.month}/${r.year}`}</h3>
                  <p className="text-xs text-muted-foreground">Period: {r.period_start} — {r.period_end}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">${Number(r.total_gross || 0).toLocaleString()}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-green-100 text-green-700">
                    {r.status || "Completed"}
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

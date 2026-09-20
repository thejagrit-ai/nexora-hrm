import { useState, useEffect } from "react";
import { payrollGet } from "@/api/payroll-client";
import { FileText, Download } from "lucide-react";

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayslips() {
      setLoading(true);
      try {
        const res = await payrollGet("/payslips");
        const list = Array.isArray(res) ? res : (res?.data || []);
        setPayslips(list);
      } catch (err) {
        console.warn("Failed to load payslips:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayslips();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Employee Payslips</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Access and download employee monthly salary statements.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/40 rounded animate-pulse" />
            ))}
          </div>
        ) : payslips.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No payslips available for this period.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payslips.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{p.employee_name || "Employee Payslip"}</h3>
                    <p className="text-xs text-muted-foreground">Month: {p.month}/{p.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">${Number(p.net_pay || 0).toLocaleString()}</span>
                  <button className="px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-muted/80 flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

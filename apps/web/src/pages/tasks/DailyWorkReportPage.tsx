import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { ClipboardList, Plus } from "lucide-react";

export default function DailyWorkReportPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ report_date: new Date().toISOString().split("T")[0], tasks_completed: "", blockers: "", hours_logged: 8 });

  const { data: reports, isLoading } = useQuery({
    queryKey: ["daily-work-reports"],
    queryFn: () => api.get("/enterprise/tasks/reports").then((r) => r.data.data),
  });

  const submitReport = useMutation({
    mutationFn: (data: typeof form) => api.post("/enterprise/tasks/reports", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["daily-work-reports"] });
      setShowModal(false);
      setForm({ report_date: new Date().toISOString().split("T")[0], tasks_completed: "", blockers: "", hours_logged: 8 });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Task Assignment & Daily Work Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Submit daily work logs, recurring task status, and operational progress reports
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Submit Work Log
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Tasks Completed</th>
              <th className="py-2.5 px-3">Blockers / Notes</th>
              <th className="py-2.5 px-3">Hours Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Loading reports...</td></tr>
            ) : !reports || reports.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No work reports logged for today.</td></tr>
            ) : (
              reports.map((r: any) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="py-3 px-3 font-semibold">{new Date(r.report_date).toLocaleDateString()}</td>
                  <td className="py-3 px-3 max-w-sm whitespace-pre-line">{r.tasks_completed}</td>
                  <td className="py-3 px-3 text-muted-foreground">{r.blockers || "\u2014"}</td>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">{r.hours_logged} hrs</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">Submit Daily Work Log</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitReport.mutate(form); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.report_date}
                    onChange={(e) => setForm({ ...form, report_date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Hours Logged</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={24}
                    value={form.hours_logged}
                    onChange={(e) => setForm({ ...form, hours_logged: Number(e.target.value) || 8 })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Completed Tasks</label>
                <textarea
                  rows={4}
                  required
                  placeholder="- Completed API integration for billing module&#10;- Reviewed PR for leave quota bug"
                  value={form.tasks_completed}
                  onChange={(e) => setForm({ ...form, tasks_completed: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Blockers / Dependencies (Optional)</label>
                <input
                  type="text"
                  placeholder="Waiting for AWS credentials"
                  value={form.blockers}
                  onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-border text-xs rounded-lg">Cancel</button>
                <button type="submit" disabled={submitReport.isPending} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-semibold">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

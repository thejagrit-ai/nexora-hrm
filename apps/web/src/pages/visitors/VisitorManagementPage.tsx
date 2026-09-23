import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Plus, Building2 } from "lucide-react";

export default function VisitorManagementPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ visitor_name: "", visitor_phone: "", host_name: "", purpose: "" });

  const { data: logs, isLoading } = useQuery({
    queryKey: ["visitor-logs"],
    queryFn: () => api.get("/enterprise/visitors").then((r) => r.data.data),
  });

  const createPass = useMutation({
    mutationFn: (data: typeof form) => api.post("/enterprise/visitors", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visitor-logs"] });
      setShowModal(false);
      setForm({ visitor_name: "", visitor_phone: "", host_name: "", purpose: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Visitor Management & Appointment Scheduler
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Issue digital gate passes, log guest check-ins, and schedule host appointments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Issue Gate Pass
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Pass Code</th>
              <th className="py-2.5 px-3">Visitor Name</th>
              <th className="py-2.5 px-3">Phone</th>
              <th className="py-2.5 px-3">Host Employee</th>
              <th className="py-2.5 px-3">Purpose</th>
              <th className="py-2.5 px-3">Check-In Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Loading visitor logs...</td></tr>
            ) : !logs || logs.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No visitors logged today.</td></tr>
            ) : (
              logs.map((v: any) => (
                <tr key={v.id} className="hover:bg-muted/40">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.pass_code}</td>
                  <td className="py-3 px-3 font-semibold">{v.visitor_name}</td>
                  <td className="py-3 px-3">{v.visitor_phone}</td>
                  <td className="py-3 px-3">{v.host_name}</td>
                  <td className="py-3 px-3">{v.purpose}</td>
                  <td className="py-3 px-3">{new Date(v.check_in).toLocaleTimeString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">Issue Visitor Digital Gate Pass</h3>
            <form onSubmit={(e) => { e.preventDefault(); createPass.mutate(form); }} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={form.visitor_name}
                  onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={form.visitor_phone}
                  onChange={(e) => setForm({ ...form, visitor_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Host Employee / Department</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma (Engineering)"
                  value={form.host_name}
                  onChange={(e) => setForm({ ...form, host_name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="Client Meeting / Vendor Interview"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-border text-xs rounded-lg">Cancel</button>
                <button type="submit" disabled={createPass.isPending} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-semibold">Generate Gate Pass</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

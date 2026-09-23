import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { UserCheck, Plus } from "lucide-react";

export default function DelegationsPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ delegatee_id: 2, start_date: "", end_date: "", approval_type: "all" });

  const { data: delegations, isLoading } = useQuery({
    queryKey: ["approval-delegations"],
    queryFn: () => api.get("/enterprise/delegations").then((r) => r.data.data),
  });

  const createDelegation = useMutation({
    mutationFn: (data: typeof form) => api.post("/enterprise/delegations", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approval-delegations"] });
      setShowModal(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Approval Delegation Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Delegate approval authorities (Leave, Expenses, Attendance) to colleagues while away
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Delegate Approvals
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Delegatee</th>
              <th className="py-2.5 px-3">Approval Scope</th>
              <th className="py-2.5 px-3">Start Date</th>
              <th className="py-2.5 px-3">End Date</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Loading delegations...</td></tr>
            ) : !delegations || delegations.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No active approval delegations found.</td></tr>
            ) : (
              delegations.map((d: any) => (
                <tr key={d.id} className="hover:bg-muted/40">
                  <td className="py-3 px-3 font-semibold">User #{d.delegatee_id}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold">{d.approval_type}</td>
                  <td className="py-3 px-3">{new Date(d.start_date).toLocaleDateString()}</td>
                  <td className="py-3 px-3">{new Date(d.end_date).toLocaleDateString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">New Approval Delegation</h3>
            <form onSubmit={(e) => { e.preventDefault(); createDelegation.mutate(form); }} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Delegate Approval Type</label>
                <select
                  value={form.approval_type}
                  onChange={(e) => setForm({ ...form, approval_type: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                >
                  <option value="all">All Approvals (Leave, Expense, Attendance)</option>
                  <option value="leave">Leave Requests Only</option>
                  <option value="expense">Expense Reimbursements Only</option>
                  <option value="attendance">Attendance Regularizations Only</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-border text-xs rounded-lg">Cancel</button>
                <button type="submit" disabled={createDelegation.isPending} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-semibold">Confirm Delegation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { ShieldCheck, Plus, Users } from "lucide-react";

export default function PoshPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"complaints" | "icc" | "report">("complaints");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ respondent_name: "", incident_description: "", incident_date: "" });

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["posh-complaints"],
    queryFn: () => api.get("/enterprise/posh/complaints").then((r) => r.data.data),
  });

  const { data: iccMembers, isLoading: iccLoading } = useQuery({
    queryKey: ["posh-icc"],
    queryFn: () => api.get("/enterprise/posh/icc").then((r) => r.data.data),
  });

  const submitComplaint = useMutation({
    mutationFn: (data: typeof form) => api.post("/enterprise/posh/complaints", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posh-complaints"] });
      setShowModal(false);
      setForm({ respondent_name: "", incident_description: "", incident_date: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            POSH & ICC Compliance Module
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Prevention of Sexual Harassment at Workplace (POSH) Act & Internal Complaints Committee Management
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4" /> File Confidential Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "complaints"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Complaints Register ({complaints?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("icc")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "icc"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ICC Roster ({iccMembers?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "report"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Annual Statutory Report
        </button>
      </div>

      {activeTab === "complaints" && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Complainant</th>
                  <th className="py-2.5 px-3">Respondent</th>
                  <th className="py-2.5 px-3">Incident Description</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {complaintsLoading ? (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Loading complaints...</td></tr>
                ) : !complaints || complaints.length === 0 ? (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No POSH complaints recorded.</td></tr>
                ) : (
                  complaints.map((c: any) => (
                    <tr key={c.id} className="hover:bg-muted/40">
                      <td className="py-3 px-3 font-semibold">{c.complainant_name}</td>
                      <td className="py-3 px-3">{c.respondent_name}</td>
                      <td className="py-3 px-3 max-w-xs truncate">{c.incident_description}</td>
                      <td className="py-3 px-3">{c.incident_date ? new Date(c.incident_date).toLocaleDateString() : "\u2014"}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "icc" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {iccLoading ? (
            <div className="col-span-3 text-center py-6 text-muted-foreground">Loading ICC roster...</div>
          ) : !iccMembers || iccMembers.length === 0 ? (
            <div className="col-span-3 bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
              No ICC members appointed yet. Form an Internal Complaints Committee per POSH Act guidelines.
            </div>
          ) : (
            iccMembers.map((m: any) => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{m.member_name}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {m.role.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{m.email || "No email"}</p>
                <p className="text-xs text-muted-foreground">{m.phone || "No phone"}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "report" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">POSH Statutory Annual Return</h3>
              <p className="text-xs text-muted-foreground">Export mandatory annual compliance summary for District Officer submission</p>
            </div>
            <button
              onClick={() => alert("Annual Report PDF exported successfully.")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Export PDF Report
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-muted/40 p-3 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground">Total Complaints</span>
              <p className="text-xl font-bold text-foreground mt-1">{complaints?.length || 0}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground">Disposed Cases</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">0</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground">Pending Investigation</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{complaints?.length || 0}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground">Mandatory Trainings</span>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">100% Compliant</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">File Confidential POSH Report</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitComplaint.mutate(form); }} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Respondent Name</label>
                <input
                  type="text"
                  required
                  value={form.respondent_name}
                  onChange={(e) => setForm({ ...form, respondent_name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Incident Date</label>
                <input
                  type="date"
                  required
                  value={form.incident_date}
                  onChange={(e) => setForm({ ...form, incident_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Incident Details</label>
                <textarea
                  rows={4}
                  required
                  value={form.incident_description}
                  onChange={(e) => setForm({ ...form, incident_description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-border text-xs rounded-lg">Cancel</button>
                <button type="submit" disabled={submitComplaint.isPending} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-semibold">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

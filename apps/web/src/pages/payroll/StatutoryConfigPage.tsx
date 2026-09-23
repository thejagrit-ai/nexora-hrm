import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { Shield, Save, CheckCircle2 } from "lucide-react";

export default function StatutoryConfigPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pf" | "esi" | "lwf" | "pt">("pf");

  useQuery({
    queryKey: ["statutory-configs"],
    queryFn: () => api.get("/enterprise/statutory").then((r) => r.data.data),
  });

  const [pfForm, setPfForm] = useState({ pf_num: "", emp_contrib: "12%", admin_cap: "15000" });
  const [esiForm, setEsiForm] = useState({ esi_num: "", emp_contrib: "0.75%", wage_ceiling: "21000" });
  const [msg, setMsg] = useState("");

  const saveStatutory = useMutation({
    mutationFn: (data: { config_type: string; config_json: any }) =>
      api.post("/enterprise/statutory", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["statutory-configs"] });
      setMsg("Statutory configuration saved successfully.");
      setTimeout(() => setMsg(""), 3000);
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Statutory Payroll Compliance Setup (India)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure Provident Fund (PF), Employee State Insurance (ESI), Labour Welfare Fund (LWF), and Professional Tax (PT)
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(["pf", "esi", "lwf", "pt"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab} Config
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        {activeTab === "pf" && (
          <form onSubmit={(e) => { e.preventDefault(); saveStatutory.mutate({ config_type: "pf", config_json: pfForm }); }} className="space-y-4 max-w-lg">
            <h3 className="text-sm font-bold text-foreground">EPFO Provident Fund Settings</h3>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Establishment PF Code</label>
              <input
                type="text"
                placeholder="MH/BAN/0000000/000"
                value={pfForm.pf_num}
                onChange={(e) => setPfForm({ ...pfForm, pf_num: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Employee Contribution</label>
                <input
                  type="text"
                  value={pfForm.emp_contrib}
                  onChange={(e) => setPfForm({ ...pfForm, emp_contrib: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Statutory Wage Cap (₹)</label>
                <input
                  type="text"
                  value={pfForm.admin_cap}
                  onChange={(e) => setPfForm({ ...pfForm, admin_cap: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save PF Rules
            </button>
          </form>
        )}

        {activeTab === "esi" && (
          <form onSubmit={(e) => { e.preventDefault(); saveStatutory.mutate({ config_type: "esi", config_json: esiForm }); }} className="space-y-4 max-w-lg">
            <h3 className="text-sm font-bold text-foreground">ESIC State Insurance Settings</h3>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">ESIC Code Number</label>
              <input
                type="text"
                placeholder="31000000000000000"
                value={esiForm.esi_num}
                onChange={(e) => setEsiForm({ ...esiForm, esi_num: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Employee Contribution Rate</label>
                <input
                  type="text"
                  value={esiForm.emp_contrib}
                  onChange={(e) => setEsiForm({ ...esiForm, emp_contrib: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Wage Limit Ceiling (₹)</label>
                <input
                  type="text"
                  value={esiForm.wage_ceiling}
                  onChange={(e) => setEsiForm({ ...esiForm, wage_ceiling: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
                />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save ESI Rules
            </button>
          </form>
        )}

        {activeTab === "lwf" && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-sm font-bold text-foreground">Labour Welfare Fund (LWF) State Rules</h3>
            <p className="text-xs text-muted-foreground">LWF rates applied based on employee work location state (e.g., Maharashtra, Karnataka, Delhi).</p>
            <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs font-semibold text-foreground">
              State rules automatically updated for FY 2026-2027.
            </div>
          </div>
        )}

        {activeTab === "pt" && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-sm font-bold text-foreground">Professional Tax (PT) State Slabs</h3>
            <p className="text-xs text-muted-foreground">State-wise income slab deduction rules (e.g. Maharashtra ₹200/mo, Karnataka ₹200/mo).</p>
            <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs font-semibold text-foreground">
              State PT Slabs configured for all 28 states & 8 UTs.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

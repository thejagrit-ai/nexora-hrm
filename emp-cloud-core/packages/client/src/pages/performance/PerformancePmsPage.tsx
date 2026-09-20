import { useState } from "react";
import { Target, Award } from "lucide-react";

export default function PerformancePmsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "kpi" | "cycles">("overview");

  const sampleKpis = [
    { id: 1, title: "Sprint Delivery & Quality", category: "Engineering", target: 95, current: 92 },
    { id: 2, title: "Customer Satisfaction Index (CSAT)", category: "Support", target: 90, current: 94 },
    { id: 3, title: "Employee Retention & Culture", category: "HR", target: 85, current: 88 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Performance Management (KRA & KPI Calibration)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Key Result Areas (KRAs), Key Performance Indicators (KPIs), appraisal cycles, and rating calibration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Performance Overview
        </button>
        <button
          onClick={() => setActiveTab("kpi")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "kpi"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          KRAs & KPIs Library
        </button>
        <button
          onClick={() => setActiveTab("cycles")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "cycles"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Review Cycles & Calibration
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <span className="text-xs text-muted-foreground font-medium">Annual Review Cycle</span>
            <p className="text-lg font-bold text-foreground">FY 2026-2027 Appraisal</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              Self-Review Phase Active
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <span className="text-xs text-muted-foreground font-medium">Org Goal Completion</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">91.4%</p>
            <p className="text-xs text-muted-foreground">Target: 90% across departments</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <span className="text-xs text-muted-foreground font-medium">Top Performers</span>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">14 Employees</p>
            <p className="text-xs text-muted-foreground">Rated Exceeding Expectations (4.5+)</p>
          </div>
        </div>
      )}

      {activeTab === "kpi" && (
        <div className="bg-card border border-border rounded-xl p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">KPI Goal Title</th>
                <th className="py-2.5 px-3">Department Category</th>
                <th className="py-2.5 px-3">Target Score</th>
                <th className="py-2.5 px-3">Achieved</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sampleKpis.map((k) => (
                <tr key={k.id} className="hover:bg-muted/40">
                  <td className="py-3 px-3 font-semibold">{k.title}</td>
                  <td className="py-3 px-3">{k.category}</td>
                  <td className="py-3 px-3 font-bold">{k.target}%</td>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{k.current}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      On Track
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "cycles" && (
        <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-xs space-y-2">
          <Award className="h-8 w-8 mx-auto text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-foreground">Review Calibration 9-Box Grid</h3>
          <p>Manager & Peer 360-degree calibration matrix enabled for current cycle.</p>
        </div>
      )}
    </div>
  );
}

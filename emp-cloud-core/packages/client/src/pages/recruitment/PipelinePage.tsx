import { useState, useEffect } from "react";
import { recruitGet, recruitPatch } from "@/api/recruit-client";
import { showToast } from "@/components/ui/Toast";

const STAGES = [
  { id: "applied", name: "Applied", color: "border-blue-500" },
  { id: "screening", name: "Screening", color: "border-indigo-500" },
  { id: "interview", name: "Interview", color: "border-purple-500" },
  { id: "offer", name: "Offer", color: "border-amber-500" },
  { id: "hired", name: "Hired", color: "border-green-500" },
  { id: "rejected", name: "Rejected", color: "border-red-500" },
];

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCandidates() {
    setLoading(true);
    try {
      const res = await recruitGet("/candidates");
      const list = Array.isArray(res) ? res : (res?.data || []);
      setCandidates(list);
    } catch (err) {
      console.warn("Failed to load pipeline candidates:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  const moveCandidateStage = async (candidateId: string, newStage: string) => {
    try {
      await recruitPatch(`/candidates/${candidateId}`, { stage: newStage });
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
      );
      showToast("success", `Moved candidate stage to ${newStage}`);
    } catch (err) {
      showToast("error", "Failed to update candidate stage");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recruitment Kanban Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visual talent tracking pipeline across recruitment stages.
        </p>
      </div>

      {/* Kanban Columns */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((s) => (
            <div key={s.id} className="h-96 bg-card border border-border rounded-xl p-4 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => (c.stage || "applied") === stage.id);
            return (
              <div key={stage.id} className="bg-card border border-border rounded-xl p-3 shadow-sm flex flex-col min-h-[500px]">
                <div className={`border-l-4 ${stage.color} pl-2 py-1 mb-3 flex items-center justify-between`}>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{stage.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5">
                  {stageCandidates.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                      Empty stage
                    </div>
                  ) : (
                    stageCandidates.map((c) => (
                      <div key={c.id} className="bg-background border border-border rounded-lg p-3 shadow-xs hover:shadow-sm transition-shadow space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-bold text-foreground line-clamp-1">{c.first_name} {c.last_name}</p>
                        </div>

                        <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>

                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <select
                            value={c.stage || "applied"}
                            onChange={(e) => moveCandidateStage(c.id, e.target.value)}
                            className="bg-card border border-border text-[10px] font-medium text-foreground rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

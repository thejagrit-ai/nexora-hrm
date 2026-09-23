import { useState, useEffect } from "react";
import { recruitGet } from "@/api/recruit-client";
import { CalendarCheck, Video } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      setLoading(true);
      try {
        const res = await recruitGet("/interviews");
        const list = Array.isArray(res) ? res : (res?.data || []);
        setInterviews(list);
      } catch (err) {
        console.warn("Failed to load interviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Interview Schedule</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upcoming and past candidate interview sessions.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/40 rounded animate-pulse" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {interviews.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-bold flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title || "Candidate Interview"}</h3>
                    <p className="text-xs text-muted-foreground">{item.candidate_name || item.candidate?.email || "Candidate"}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{item.scheduled_at ? new Date(item.scheduled_at).toLocaleDateString() : "Scheduled"}</p>
                  <p>{item.duration_minutes ? `${item.duration_minutes} mins` : "30 mins"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

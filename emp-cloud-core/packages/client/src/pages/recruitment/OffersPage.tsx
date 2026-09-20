import { useState, useEffect } from "react";
import { recruitGet } from "@/api/recruit-client";
import { Award, ScrollText } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const res = await recruitGet("/offers");
        const list = Array.isArray(res) ? res : (res?.data || []);
        setOffers(list);
      } catch (err) {
        console.warn("Failed to load offers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Offers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Job offer letters and offer acceptance management.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/40 rounded animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center">
            <ScrollText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No job offers generated yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {offers.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-bold flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.job_title || "Job Offer"}</h3>
                    <p className="text-xs text-muted-foreground">{item.candidate_name || "Candidate"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-foreground">${item.salary ? Number(item.salary).toLocaleString() : "—"} / yr</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-amber-100 text-amber-700">
                    {item.status || "Pending"}
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

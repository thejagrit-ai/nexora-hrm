import { useState, useEffect } from "react";
import { recruitGet } from "@/api/recruit-client";
import {
  Briefcase,
  Users,
  CalendarCheck,
  Award,
  Plus,
  TrendingUp,
  ChevronRight,
  Building2,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruitmentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    upcomingInterviews: 0,
    pendingOffers: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
          recruitGet("/jobs"),
          recruitGet("/candidates"),
          recruitGet("/interviews"),
          recruitGet("/offers"),
        ]);

        const jobs = jobsRes.status === "fulfilled" ? (jobsRes.value?.data || jobsRes.value || []) : [];
        const candidates = candidatesRes.status === "fulfilled" ? (candidatesRes.value?.data || candidatesRes.value || []) : [];
        const interviews = interviewsRes.status === "fulfilled" ? (interviewsRes.value?.data || interviewsRes.value || []) : [];
        const offers = offersRes.status === "fulfilled" ? (offersRes.value?.data || offersRes.value || []) : [];

        setStats({
          activeJobs: Array.isArray(jobs) ? jobs.filter((j: any) => j.status === "open" || j.status === "active").length : (jobs.length || 0),
          totalCandidates: Array.isArray(candidates) ? candidates.length : 0,
          upcomingInterviews: Array.isArray(interviews) ? interviews.length : 0,
          pendingOffers: Array.isArray(offers) ? offers.filter((o: any) => o.status === "pending" || o.status === "draft").length : 0,
        });

        setRecentJobs(Array.isArray(jobs) ? jobs.slice(0, 5) : []);
        setRecentCandidates(Array.isArray(candidates) ? candidates.slice(0, 5) : []);
      } catch (err) {
        console.warn("Failed to load recruitment dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Talent & Recruitment Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage job postings, candidate pipelines, interviews, and job offers in NEXORA HR.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/recruitment/jobs"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Job Opening
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Jobs</span>
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.activeJobs}</span>
            <span className="text-xs text-emerald-600 font-medium ml-2 inline-flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Live Openings
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Candidates</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.totalCandidates}</span>
            <span className="text-xs text-muted-foreground ml-2">In Pipeline</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews</span>
            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.upcomingInterviews}</span>
            <span className="text-xs text-muted-foreground ml-2">Scheduled</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Offers</span>
            <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground">{loading ? "..." : stats.pendingOffers}</span>
            <span className="text-xs text-purple-600 font-medium ml-2">Awaiting Decision</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Open Jobs & Recent Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Job Openings (2 cols) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Job Openings</h2>
            <Link to="/recruitment/jobs" className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground font-medium">No job postings created yet.</p>
              <Link to="/recruitment/jobs" className="text-xs text-brand-600 hover:underline mt-1 inline-block">Create your first job posting</Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-3.5 flex items-center justify-between hover:bg-muted/30 px-2 rounded-lg transition-colors">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.department || "General"}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location || "Remote"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      job.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {job.status || "Open"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Candidates */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Candidates</h2>
            <Link to="/recruitment/candidates" className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentCandidates.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground font-medium">No candidates in pipeline.</p>
              <Link to="/recruitment/candidates" className="text-xs text-brand-600 hover:underline mt-1 inline-block">Add candidate</Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentCandidates.map((cand) => (
                <div key={cand.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {cand.first_name?.[0] || "C"}{cand.last_name?.[0] || ""}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cand.first_name} {cand.last_name}</p>
                      <p className="text-xs text-muted-foreground">{cand.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {cand.stage || "Applied"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

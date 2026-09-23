import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Briefcase, FileText, CalendarDays, Settings, ArrowRight, X } from "lucide-react";
import api from "@/api/client";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setEmployees([]);
      setJobs([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [empRes, jobRes] = await Promise.allSettled([
          api.get("/employees", { params: { search: query, limit: 5 } }),
          api.get("/recruit/jobs", { params: { search: query, limit: 5 } }),
        ]);

        if (empRes.status === "fulfilled" && empRes.value.data?.data) {
          setEmployees(empRes.value.data.data);
        } else {
          setEmployees([]);
        }

        if (jobRes.status === "fulfilled" && jobRes.value.data?.data) {
          setJobs(jobRes.value.data.data);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickNavLinks = [
    { label: "Employees Directory", path: "/employees", icon: Users },
    { label: "Attendance & Shifts", path: "/attendance", icon: CalendarDays },
    { label: "Leave Requests", path: "/leave", icon: CalendarDays },
    { label: "Recruitment & Jobs", path: "/recruitment/jobs", icon: Briefcase },
    { label: "Payroll & Compensation", path: "/payroll", icon: FileText },
    { label: "Organization Settings", path: "/settings", icon: Settings },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center px-4 py-3 border-b border-border gap-3">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search employees, jobs, leave, documents... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
              Searching NEXORA HR records...
            </div>
          )}

          {!query && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Quick Navigation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleSelect(link.path)}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{link.label}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {query && !loading && (
            <div className="space-y-4">
              {employees.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Employees ({employees.length})</p>
                  <div className="space-y-1">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => handleSelect(`/employees/${emp.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {emp.first_name?.charAt(0) || "E"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{emp.first_name} {emp.last_name}</p>
                            <p className="text-[11px] text-muted-foreground">{emp.designation || emp.role || "Employee"} • {emp.email}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {jobs.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Job Openings ({jobs.length})</p>
                  <div className="space-y-1">
                    {jobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => handleSelect(`/recruitment/jobs`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{job.title}</p>
                            <p className="text-[11px] text-muted-foreground">{job.department || "General"} • {job.location || "Remote"}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {employees.length === 0 && jobs.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matching records found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Esc</kbd> to exit</span>
          <span>NEXORA HR Search</span>
        </div>
      </div>
    </div>
  );
}

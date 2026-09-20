import { useState, useEffect } from "react";
import { recruitGet, recruitPost } from "@/api/recruit-client";
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Building2,
  Filter
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  // New Job Form State
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Remote",
    employment_type: "full_time",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
  });

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await recruitGet("/jobs");
      const list = Array.isArray(res) ? res : (res?.data || []);
      setJobs(list);
    } catch (err) {
      console.warn("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recruitPost("/jobs", {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        status: "open",
      });
      showToast("success", "Job opening created successfully");
      setShowModal(false);
      setFormData({
        title: "",
        department: "",
        location: "Remote",
        employment_type: "full_time",
        description: "",
        requirements: "",
        salary_min: "",
        salary_max: "",
      });
      loadJobs();
    } catch (err: any) {
      showToast("error", err.response?.data?.error?.message || "Failed to create job opening");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Openings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, track, and manage active job listings for your organization.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create New Job
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search job title, department, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open / Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-card border border-border rounded-xl p-5 animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-semibold text-foreground">No Job Openings Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            No job listings match your search criteria. Create a new job listing to start recruiting.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Job Opening
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-foreground line-clamp-1">{job.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${
                    job.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {job.status || "open"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span>{job.department || "General"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  {job.salary_min && job.salary_max && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {job.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="capitalize">{job.employment_type?.replace("_", " ") || "Full Time"}</span>
                <span className="font-medium text-brand-600 hover:underline cursor-pointer">Manage Candidates</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form for Create Job */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Create New Job Opening</h2>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Salary Min ($)</label>
                  <input
                    type="number"
                    placeholder="80000"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Salary Max ($)</label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Job summary and key responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 shadow-sm"
                >
                  Save Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

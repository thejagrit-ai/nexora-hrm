import { useState, useEffect } from "react";
import { payrollGet } from "@/api/payroll-client";
import { Users, Search } from "lucide-react";

export default function PayrollEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);
      try {
        const res = await payrollGet("/employees");
        const list = Array.isArray(res) ? res : (res?.data || []);
        setEmployees(list);
      } catch (err) {
        console.warn("Failed to load payroll employees:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEmployees();
  }, []);

  const filtered = employees.filter((e) => {
    const name = `${e.first_name || ""} ${e.last_name || ""}`.toLowerCase();
    return !search || name.includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Employee Salary Profiles</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage employee compensation profiles, bank accounts, and tax withholding declarations.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employee name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No salary profiles found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Pay Frequency</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      <div>
                        <p>{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-muted-foreground font-normal">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      ${Number(emp.base_salary || emp.salary || 0).toLocaleString()} / yr
                    </td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">
                      {emp.pay_frequency || "Monthly"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground uppercase font-medium">
                      {emp.currency || "USD"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                        Edit Structure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

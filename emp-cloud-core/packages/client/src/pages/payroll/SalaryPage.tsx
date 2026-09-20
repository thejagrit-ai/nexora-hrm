import { useState, useEffect } from "react";
import { payrollGet } from "@/api/payroll-client";

export default function SalaryPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSalary() {
      setLoading(true);
      try {
        await payrollGet("/salary-structures");
      } catch (err) {
        console.warn("Failed to load salary structures:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSalary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Compensation & Salary Structures</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure salary components, allowances, deductions, and bonus structures.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="h-32 bg-muted/40 rounded animate-pulse" />
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Standard Compensation Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Basic Pay</p>
                <p className="text-xl font-extrabold text-foreground mt-1">50%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Of Total Gross Salary</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Housing Allowance (HRA)</p>
                <p className="text-xl font-extrabold text-foreground mt-1">30%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tax Exempt Portion</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Special Allowances</p>
                <p className="text-xl font-extrabold text-foreground mt-1">20%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Flexible Benefit Basket</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Shield, FileText, CheckCircle2 } from "lucide-react";

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Taxes & Statutory Compliance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tax withholding slabs, statutory deductions, and compliance filings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Income Tax Withholding (TDS/W-2)</h3>
              <p className="text-xs text-muted-foreground">Automated tax calculation based on employee declarations</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-green-600 inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Compliant & Active
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Social Security & Pension Contributions</h3>
              <p className="text-xs text-muted-foreground">Employer and employee provident fund calculations</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-green-600 inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Compliant & Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

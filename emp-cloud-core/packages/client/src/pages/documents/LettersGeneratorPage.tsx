import { useState } from "react";
import { FileText, Printer } from "lucide-react";

export default function LettersGeneratorPage() {
  const [category, setCategory] = useState<"experience" | "relieving" | "offer" | "noc">("experience");
  const [empName, setEmpName] = useState("John Doe");
  const [designation, setDesignation] = useState("Senior Software Engineer");
  const [doj, setDoj] = useState("2024-01-15");
  const [lastDate, setLastDate] = useState("2026-09-30");

  const sampleLetter = `TO WHOMSOEVER IT MAY CONCERN

Date: ${new Date().toLocaleDateString()}

This is to certify that ${empName} was employed with our organization as a ${designation} from ${doj} to ${lastDate}.

During their tenure with us, we found ${empName} to be hardworking, professional, and dedicated to their duties.

We wish them all the best in their future endeavors.

For TechNova Solutions,

Authorized Signatory
Human Resources Department`;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Letters & Certificates Generator
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Generate Experience Certificates, Relieving Letters, Offer Letters, and NOC documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Document Details</h3>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Letter Type</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
            >
              <option value="experience">Experience Certificate</option>
              <option value="relieving">Relieving Letter</option>
              <option value="offer">Appointment / Offer Letter</option>
              <option value="noc">No Objection Certificate (NOC)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Employee Name</label>
            <input
              type="text"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Joining Date</label>
              <input
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Last Date</label>
              <input
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background"
              />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-8 shadow-xs">
          <div className="border border-border/80 p-8 rounded-xl bg-white text-gray-900 font-serif leading-relaxed whitespace-pre-line text-sm min-h-[400px]">
            {sampleLetter}
          </div>
        </div>
      </div>
    </div>
  );
}

import { X, Printer, ShieldCheck, Sparkles, Building2, QrCode } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { EmployeeAvatar } from "@/components/EmployeeAvatar";

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  meProfile?: any;
}

export function IdCardModal({ isOpen, onClose, meProfile }: IdCardModalProps) {
  const { user } = useAuthStore();

  if (!isOpen || !user) return null;

  const companyName = user.org_name || "Technova Solutions";
  const empIdStr = `EMP-${user.id.toString().padStart(4, "0")}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-foreground">Digital Employee ID Card</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Printable Card */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
          <div className="id-card-print-area w-full max-w-[340px] rounded-2xl bg-card border border-border/90 shadow-lg overflow-hidden relative">
            {/* Top Branding Ribbon */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-4 text-white text-center relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Building2 className="w-24 h-24 text-white" />
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="h-5 w-5 rounded bg-white/20 flex items-center justify-center text-white font-black text-xs">
                  N
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-100">
                  {companyName}
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-white/80 font-medium">
                Official Enterprise Pass
              </p>
            </div>

            {/* Photo & Details */}
            <div className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md">
                <EmployeeAvatar
                  userId={user.id}
                  firstName={user.first_name}
                  lastName={user.last_name}
                  hasPhoto={!!meProfile?.photo_path}
                  hasBiometricFace={!!meProfile?.has_biometric_face}
                  size="xl"
                />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize mt-0.5">
                  {user.role.replace(/_/g, " ")}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">
                  ID: <span className="font-bold text-foreground">{empIdStr}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="w-full grid grid-cols-2 gap-2 text-left pt-2 border-t border-border/60 text-xs">
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Company
                  </span>
                  <span className="font-semibold text-foreground truncate block">
                    {companyName}
                  </span>
                </div>
                <div className="bg-muted/40 p-2 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Status
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
              </div>

              {/* Barcode & QR placeholder */}
              <div className="pt-2 w-full flex items-center justify-between px-2">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-mono text-muted-foreground">SCAN AUTHORIZATION</span>
                  <div className="flex gap-0.5 h-6 items-center mt-1">
                    {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4].map((w, i) => (
                      <div
                        key={i}
                        className="bg-foreground h-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-card border border-border shadow-2xs">
                  <QrCode className="h-8 w-8 text-foreground" />
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-border/60 bg-card flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Nexsora Digital ID
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

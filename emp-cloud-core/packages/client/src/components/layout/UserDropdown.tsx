import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { useTranslation } from "react-i18next";
import { EmployeeAvatar } from "@/components/EmployeeAvatar";
import { User, IdCard, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserDropdownProps {
  meProfile?: any;
  onOpenIdCard: () => void;
}

export function UserDropdown({ meProfile, onOpenIdCard }: UserDropdownProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const roleLabel =
    user?.role === "super_admin"
      ? "Platform Admin"
      : user?.role === "org_admin"
      ? "Org Admin"
      : user?.role === "hr_admin"
      ? "HR Admin"
      : "Employee";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="relative">
          <EmployeeAvatar
            userId={user?.id}
            firstName={user?.first_name}
            lastName={user?.last_name}
            hasPhoto={!!meProfile?.photo_path}
            hasBiometricFace={!!meProfile?.has_biometric_face}
            size="sm"
          />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
        </div>

        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {user?.org_name || "Technova Solutions"}
          </span>
        </div>

        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border/80 shadow-xl py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-3">
              <EmployeeAvatar
                userId={user?.id}
                firstName={user?.first_name}
                lastName={user?.last_name}
                hasPhoto={!!meProfile?.photo_path}
                hasBiometricFace={!!meProfile?.has_biometric_face}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1 space-y-0.5">
            <Link
              to={user?.id ? `/employees/${user.id}` : "/my-profile"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{t("nav.myProfile", "My Profile")}</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenIdCard();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
            >
              <IdCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>My ID Card</span>
            </button>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span>{t("nav.settings", "Settings")}</span>
            </Link>
          </div>

          <div className="p-1 border-t border-border/60">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("nav.signOut", "Sign Out")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { NavSection } from "./NavSection";
import { UserDropdown } from "./UserDropdown";
import { IdCardModal } from "@/components/common/IdCardModal";
import {
  employeeNavItems,
  adminNavItems,
  positionNavItems,
  biometricsNavItems,
  orgAdminOnlyNavItems,
  platformAdminNavItems,
  HR_ROLES,
  filterNavItem,
  type NavItem,
} from "./navigation.config";
import { usePermissions } from "@/lib/use-permissions";
import { useViewModeStore, hasAnyAdminPermission } from "@/lib/use-view-mode";
import { ViewModeToggle } from "./ViewModeToggle";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearchModal } from "@/components/common/GlobalSearchModal";

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("empcloud-sidebar-collapsed") === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "empcloud-sidebar-collapsed",
      sidebarCollapsed ? "1" : "0",
    );
  }, [sidebarCollapsed]);

  const sidebarNavRef = useRef<HTMLElement>(null);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch org subscriptions to conditionally show module nav items (HR+ only)
  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => api.get("/subscriptions").then((r) => r.data.data),
    staleTime: 60000,
    enabled: !!(user && HR_ROLES.includes(user.role)),
  });

  const { data: meProfile } = useQuery({
    queryKey: ["me-avatar", user?.id],
    queryFn: () => api.get(`/employees/${user!.id}/profile`).then((r) => r.data.data),
    enabled: !!user?.id,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: chatStatus } = useQuery({
    queryKey: ["chat-feature-status"],
    queryFn: () => api.get("/chat/feature-status").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });
  const chatEnabled = chatStatus?.enabled !== false;

  const { data: chatUnread } = useQuery({
    queryKey: ["chat-unread-count"],
    queryFn: () => api.get("/chat/unread-count").then((r) => r.data.data?.unread_count ?? 0),
    enabled: !!user && chatEnabled,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const unreadByPath: Record<string, number> = { "/messages": chatUnread ?? 0 };

  const hasBiometrics = (subscriptions || []).some(
    (s: any) => s.module_slug === "emp-biometrics" && (s.status === "active" || s.status === "trial")
  );

  const isHR = !!(user && HR_ROLES.includes(user.role));
  const isOrgAdmin = user?.role === "org_admin";

  const { has: hasPerm, permissions } = usePermissions();
  const viewMode = useViewModeStore((s) => s.viewMode);
  const hasAdminPerms = hasAnyAdminPermission(permissions);
  const showViewToggle = !isHR && hasAdminPerms;
  const effectiveViewMode = !showViewToggle && !isHR ? "self" : viewMode;
  const showAdminSidebar = isHR || (showViewToggle && effectiveViewMode === "admin");
  const sidebarItems = (showAdminSidebar ? adminNavItems : employeeNavItems)
    .map((i) => filterNavItem(i, hasPerm))
    .filter((i): i is NavItem => i !== null)
    .filter((i) => chatEnabled || i.path !== "/messages");

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const navEl = sidebarNavRef.current;
    if (!navEl) return;
    const activeLink = navEl.querySelector('[data-active="true"]');
    if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [location.pathname]);

  const renderSidebar = (isCollapsed: boolean) => (
    <div className="flex h-full w-full flex-col bg-card border-r border-border/80 select-none overflow-hidden">
      {/* Brand Header */}
      <Link
        to="/"
        title={isCollapsed ? "Nexsora HRM" : undefined}
        className={`block border-b border-border/60 hover:bg-muted/40 transition-colors shrink-0 ${
          isCollapsed ? "p-3" : "px-4 py-3.5"
        }`}
      >
        {isCollapsed ? (
          <div className="flex justify-center py-0.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-xs">
              N
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
              N
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                Nexsora HRM
              </span>
              <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
                Enterprise Cloud
              </span>
            </div>
          </div>
        )}
      </Link>

      <button
        className="md:hidden absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={() => setSidebarOpen(false)}
      >
        <X className="h-5 w-5" />
      </button>

      <nav ref={sidebarNavRef} className="flex-1 p-2.5 space-y-1 overflow-y-auto">
        {user?.role !== "super_admin" && (
          <>
            <NavSection
              label=""
              items={sidebarItems}
              location={location}
              t={t}
              unreadByPath={unreadByPath}
              isCollapsed={isCollapsed}
            />
            {isHR && (
              <NavSection
                label=""
                items={positionNavItems}
                location={location}
                t={t}
                isCollapsed={isCollapsed}
              />
            )}
            {hasBiometrics && (
              <NavSection
                label={t("nav.biometrics")}
                items={biometricsNavItems}
                location={location}
                t={t}
                isCollapsed={isCollapsed}
              />
            )}
            {isOrgAdmin && (
              <NavSection
                label=""
                items={orgAdminOnlyNavItems}
                location={location}
                t={t}
                isCollapsed={isCollapsed}
              />
            )}
          </>
        )}

        {user?.role === "super_admin" && (
          <NavSection
            label={t("nav.platformAdmin")}
            items={platformAdminNavItems}
            location={location}
            t={t}
            activeClass="bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold border-l-2 border-amber-600"
            isCollapsed={isCollapsed}
          />
        )}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden relative">
      {/* Desktop Fixed Sidebar Wrapper */}
      <aside
        className={`hidden md:block shrink-0 h-full relative transition-all duration-200 ease-in-out select-none ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {renderSidebar(sidebarCollapsed)}

        {/* Floating Collapse Edge Toggle */}
        <button
          onClick={() => setSidebarCollapsed((c) => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex absolute top-12 -right-3 h-6 w-6 rounded-full bg-card border border-border text-muted-foreground hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs items-center justify-center transition-all duration-150 z-10"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-60 transform transition-transform duration-300 ease-in-out translate-x-0">
            {renderSidebar(false)}
          </div>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Fixed Top Navigation Bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/80 bg-card relative z-20 gap-4 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted md:hidden shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Topbar Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 max-w-md hidden sm:flex items-center justify-between px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border/60 rounded-xl text-xs text-muted-foreground transition-all duration-150"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">Search employees, leave, documents...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded-md bg-card border border-border text-[10px] font-mono text-muted-foreground shadow-2xs shrink-0 ml-2">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showViewToggle && <ViewModeToggle />}
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationDropdown />
            <UserDropdown
              meProfile={meProfile}
              onOpenIdCard={() => setIsIdCardOpen(true)}
            />
          </div>
        </header>

        {/* Main Scrollable Body Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-background min-w-0">
          <div className="w-full space-y-6 min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      <ChatWidget />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <IdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        meProfile={meProfile}
      />
    </div>
  );
}

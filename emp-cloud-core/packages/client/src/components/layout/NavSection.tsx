import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./navigation.config";
import { AiBadge } from "@/components/AiBadge";

interface NavSectionProps {
  label: string;
  items: NavItem[];
  location: { pathname: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
  activeClass?: string;
  /** Live unread counts keyed by nav path (e.g. { "/messages": 3 }). */
  unreadByPath?: Record<string, number>;
  isCollapsed?: boolean;
}

/** Small red count badge for a nav item (e.g. unread messages). */
function CountBadge({ count, isCollapsed }: { count: number; isCollapsed?: boolean }) {
  const { t } = useTranslation();
  if (count <= 0) return null;
  if (isCollapsed) {
    return (
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
    );
  }
  return (
    <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
      {count > 99 ? t("navSection.countBadge.overflow") : count}
    </span>
  );
}

function isItemActive(item: NavItem, pathname: string, allItems: NavItem[]): boolean {
  const isExact = pathname === item.path;
  const isPrefix = pathname.startsWith(item.path + "/");
  const hasMoreSpecificMatch = isPrefix && allItems.some(
    (other) => other.path !== item.path && other.path.startsWith(item.path + "/") && (pathname === other.path || pathname.startsWith(other.path + "/"))
  );
  return item.path === "/"
    ? pathname === "/"
    : isExact || (isPrefix && !hasMoreSpecificMatch);
}

function sectionLabel(section: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const slug = section
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const key = `nav.section.${slug}`;
  const translated = t(key, { defaultValue: section });
  return translated;
}

export function NavSection({
  label,
  items,
  location,
  t,
  activeClass = "bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600 dark:border-indigo-400 shadow-2xs",
  unreadByPath,
  isCollapsed = false,
}: NavSectionProps) {
  let currentSection: string | undefined;

  return (
    <>
      {label && !isCollapsed && (
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-4 mb-1.5 px-3">
          {label}
        </div>
      )}
      {items.map((item) => {
        let header: string | null = null;
        if (item.section && item.section !== currentSection) {
          header = item.section;
          currentSection = item.section;
        }
        return (
          <Fragment key={item.path}>
            {header && !isCollapsed && (
              <div className="mx-3 mt-4 mb-1.5 border-t border-border/50 pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {sectionLabel(header, t)}
              </div>
            )}
            {header && isCollapsed && (
              <div className="mx-2 my-2 border-t border-border/50" />
            )}
            {item.children ? (
              <NestedNavItem
                item={item}
                location={location}
                activeClass={activeClass}
                isCollapsed={isCollapsed}
              />
            ) : (
              <NavLink
                item={item}
                location={location}
                activeClass={activeClass}
                allItems={items}
                unread={unreadByPath?.[item.path] ?? 0}
                isCollapsed={isCollapsed}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function NavLink({
  item,
  location,
  activeClass,
  allItems = [],
  indent = false,
  unread = 0,
  isCollapsed = false,
}: {
  item: NavItem;
  location: { pathname: string };
  activeClass: string;
  allItems?: NavItem[];
  indent?: boolean;
  unread?: number;
  isCollapsed?: boolean;
}) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const isActive = isItemActive(item, location.pathname, allItems);
  const label = item.i18nKey && t(item.i18nKey) !== item.i18nKey ? t(item.i18nKey) : item.label;

  return (
    <Link
      to={item.path}
      data-active={isActive}
      title={label}
      className={`relative flex items-center ${
        isCollapsed
          ? "justify-center p-2.5 my-0.5 rounded-xl text-center"
          : indent
          ? "pl-8 pr-3 py-2 rounded-lg text-xs"
          : "px-3 py-2 rounded-lg text-xs"
      } font-medium transition-all duration-150 ${
        isActive
          ? activeClass
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      <Icon className={`${isCollapsed ? "h-5 w-5" : indent ? "h-4 w-4" : "h-4 w-4"} flex-shrink-0`} />
      {!isCollapsed && <span className="flex-1 truncate ml-2.5">{label}</span>}
      {!isCollapsed && item.badge && <AiBadge label={item.badge} />}
      <CountBadge count={unread} isCollapsed={isCollapsed} />
    </Link>
  );
}

function NestedNavItem({
  item,
  location,
  activeClass,
  isCollapsed = false,
}: {
  item: NavItem;
  location: { pathname: string };
  activeClass: string;
  isCollapsed?: boolean;
}) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const childActive = item.children?.some((child) =>
    location.pathname === child.path || location.pathname.startsWith(child.path + "/")
  );
  const [open, setOpen] = useState(!!childActive);
  const label = item.i18nKey && t(item.i18nKey) !== item.i18nKey ? t(item.i18nKey) : item.label;

  if (isCollapsed) {
    return (
      <Link
        to={item.children?.[0]?.path || "#"}
        title={label}
        className={`relative flex items-center justify-center p-2.5 my-0.5 rounded-xl text-center transition-all duration-150 ${
          childActive
            ? activeClass
            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        title={label}
        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
          childActive
            ? activeClass
            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left truncate ml-2.5">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && item.children && (
        <div className="mt-0.5 space-y-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              item={child}
              location={location}
              activeClass={activeClass}
              allItems={item.children!}
              indent
              isCollapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

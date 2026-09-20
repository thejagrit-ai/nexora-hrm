import { useTheme, type Theme } from "@/lib/theme";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: t("theme.light", "Light") },
    { value: "dark", icon: Moon, label: t("theme.dark", "Dark") },
    { value: "system", icon: Monitor, label: t("theme.system", "System") },
  ];

  return (
    <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
      {options.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`rounded-md p-1.5 text-xs font-medium transition-all duration-150 ${
              active
                ? "bg-card text-indigo-600 dark:text-indigo-400 shadow-xs border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

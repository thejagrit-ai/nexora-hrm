import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  _minDate?: string;
  _maxDate?: string;
}

export function DatePicker({
  value = "",
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  required = false,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedDate = value ? new Date(value + "T00:00:00") : null;
  const [currentMonth, setCurrentMonth] = useState<Date>(parsedDate || new Date());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const formattedDisplay = parsedDate
    ? parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium cursor-pointer transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-indigo-500/50"
        } ${isOpen ? "ring-2 ring-indigo-500/20 border-indigo-500" : ""}`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className={formattedDisplay ? "text-foreground" : "text-muted-foreground"}>
            {formattedDisplay || placeholder}
          </span>
        </div>
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-card border border-border rounded-xl shadow-xl p-3 w-64 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-foreground">
              {monthName} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-[10px] font-bold text-muted-foreground uppercase">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const y = currentMonth.getFullYear();
              const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
              const d = String(dayNum).padStart(2, "0");
              const thisIso = `${y}-${m}-${d}`;
              const isSelected = value === thisIso;
              const isToday = thisIso === new Date().toISOString().slice(0, 10);

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleDateClick(dayNum)}
                  className={`h-7 w-7 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold shadow-xs"
                      : isToday
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200/50"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const todayIso = new Date().toISOString().slice(0, 10);
                onChange(todayIso);
                setIsOpen(false);
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-muted-foreground hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

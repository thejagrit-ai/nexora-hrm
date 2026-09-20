import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface ComboboxOption {
  value: string | number;
  label: string;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  label,
  disabled = false,
  required = false,
  className = "",
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(search.toLowerCase()))
  );

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
        <span className={selectedOption ? "text-foreground font-semibold" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1">
          {value !== undefined && value !== "" && !disabled && (
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
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-full max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          {/* Search box */}
          {options.length > 5 && (
            <div className="p-2 border-b border-border flex items-center gap-2 bg-muted/30">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Options List */}
          <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p>{opt.label}</p>
                      {opt.description && <p className="text-[10px] text-muted-foreground font-normal">{opt.description}</p>}
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

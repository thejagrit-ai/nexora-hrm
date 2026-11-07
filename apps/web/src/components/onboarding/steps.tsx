import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, Package, Plus, Trash2, X } from "lucide-react";
import { leaveTypeLabel } from "@/lib/leave-type-label";
import { showToast } from "@/components/ui/Toast";
import { DISPLAY } from "@/components/auth/AuthShell";
import { Field, SelectField, TickBox, Toggle, NumberStepper, controlClass } from "./fields";

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

export const TIMEZONES = [
  "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Asia/Shanghai",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Australia/Sydney", "Pacific/Auckland",
];

export const LANGUAGES = [
  { value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }, { value: "de", label: "German" }, { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" }, { value: "zh", label: "Chinese" }, { value: "ar", label: "Arabic" },
];

const COUNTRIES = [
  ["IN", "India"], ["US", "United States"], ["GB", "United Kingdom"], ["AE", "United Arab Emirates"],
  ["SG", "Singapore"], ["AU", "Australia"], ["CA", "Canada"], ["DE", "Germany"], ["FR", "France"],
  ["NL", "Netherlands"], ["SA", "Saudi Arabia"], ["QA", "Qatar"], ["MY", "Malaysia"], ["ID", "Indonesia"],
  ["PH", "Philippines"], ["LK", "Sri Lanka"], ["BD", "Bangladesh"], ["NP", "Nepal"], ["ZA", "South Africa"],
  ["NG", "Nigeria"], ["KE", "Kenya"], ["JP", "Japan"], ["CN", "China"], ["BR", "Brazil"], ["MX", "Mexico"],
] as const;

/** Suggested timezone when the country changes. */
const COUNTRY_TZ: Record<string, string> = {
  IN: "Asia/Kolkata", AE: "Asia/Dubai", SG: "Asia/Singapore", JP: "Asia/Tokyo", CN: "Asia/Shanghai",
  GB: "Europe/London", FR: "Europe/Paris", DE: "Europe/Berlin", AU: "Australia/Sydney", US: "America/New_York",
};

const ROLES = [
  { value: "employee", label: "Employee" },
  { value: "manager", label: "Manager" },
  { value: "hr_admin", label: "HR admin" },
  { value: "org_admin", label: "Admin" },
];

const PLAN_TIERS = [
  { value: "basic", label: "Basic" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------------------------------------------------------------------------
// Step 1: Company
// ---------------------------------------------------------------------------

interface Step1Props {
  companyName: string; setCompanyName: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  state: string; setState: (v: string) => void;
  city: string; setCity: (v: string) => void;
  timezone: string; setTimezone: (v: string) => void;
  language: string; setLanguage: (v: string) => void;
  logoFile: File | null; logoPreview: string | null; logoError: string | null;
  onLogoSelected: (file: File, preview: string) => void;
  onLogoCleared: () => void;
  nameError?: string;
}

export function Step1Company(p: Step1Props) {
  const nameId = useId();
  const stateId = useId();
  const cityId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptFile = (file: File) => {
    if (!file.type.startsWith("image/")) return showToast("error", "Please choose an image (PNG, JPG, WebP or SVG).");
    if (file.size > 2 * 1024 * 1024) return showToast("error", "The logo must be 2 MB or smaller.");
    const reader = new FileReader();
    reader.onload = (e) => p.onLogoSelected(file, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Keep an unknown saved value (e.g. "India") selectable instead of silently replacing it.
  const knownCountry = COUNTRIES.some(([code]) => code === p.country);
  const tzOptions = TIMEZONES.includes(p.timezone) ? TIMEZONES : [p.timezone, ...TIMEZONES];

  return (
    <div className="space-y-6">
      <Field label="Company name" htmlFor={nameId} error={p.nameError}>
        <input
          id={nameId}
          type="text"
          autoFocus
          autoComplete="organization"
          value={p.companyName}
          onChange={(e) => p.setCompanyName(e.target.value)}
          placeholder="Acme Industries"
          aria-invalid={!!p.nameError}
          className={controlClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Country"
          value={p.country}
          onChange={(e) => {
            const code = e.target.value;
            p.setCountry(code);
            if (COUNTRY_TZ[code]) p.setTimezone(COUNTRY_TZ[code]);
          }}
        >
          {!knownCountry && p.country && <option value={p.country}>{p.country}</option>}
          {COUNTRIES.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </SelectField>
        <Field label="State" htmlFor={stateId}>
          <input id={stateId} type="text" value={p.state} onChange={(e) => p.setState(e.target.value)} placeholder="Karnataka" className={controlClass} />
        </Field>
        <Field label="City" htmlFor={cityId}>
          <input id={cityId} type="text" value={p.city} onChange={(e) => p.setCity(e.target.value)} placeholder="Bengaluru" className={controlClass} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Timezone" hint="Used for attendance and leave dates." value={p.timezone} onChange={(e) => p.setTimezone(e.target.value)}>
          {tzOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace("_", " ")}
            </option>
          ))}
        </SelectField>
        <SelectField label="Language" value={p.language} onChange={(e) => p.setLanguage(e.target.value)}>
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <p className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold">
          Company logo <span className="font-normal text-[#10231D]/55">optional</span>
        </p>
        <div
          role="button"
          tabIndex={0}
          aria-label={p.logoPreview ? "Change company logo" : "Upload company logo"}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}
          onDragOver={(e) => (e.preventDefault(), setDragOver(true))}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) acceptFile(f);
          }}
          className={`flex cursor-pointer items-center gap-5 rounded-2xl border-2 border-dashed p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E] ${
            dragOver ? "border-[#1B4D3E] bg-[#DCEBE2]" : "border-[#10231D]/25 bg-white hover:border-[#1B4D3E]/60"
          }`}
        >
          {p.logoPreview ? (
            <>
              <img src={p.logoPreview} alt="Logo preview" className="h-16 w-16 rounded-xl bg-[#EEF1EC] object-contain p-1" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold">{p.logoFile?.name}</p>
                <p className="text-sm text-[#10231D]/60">Click to choose a different file</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  p.onLogoCleared();
                  if (fileRef.current) fileRef.current.value = "";
                }}
                aria-label="Remove logo"
                className="grid h-10 w-10 place-items-center rounded-lg text-[#B02F22] hover:bg-[#F7D9D4]"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#EEF1EC] text-[#1B4D3E]">
                <ImagePlus className="h-7 w-7" />
              </span>
              <div>
                <p className="text-base font-semibold">Drop your logo here, or click to browse</p>
                <p className="text-sm text-[#10231D]/60">PNG, JPG, WebP or SVG, up to 2 MB</p>
              </div>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) acceptFile(f);
            }}
          />
        </div>
        {p.logoError && <p className="mt-2 text-sm font-medium text-[#B02F22]">{p.logoError}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Departments
// ---------------------------------------------------------------------------

interface Step2Props {
  departments: string[];
  selectedDepts: Set<string>;
  toggleDept: (name: string) => void;
  setAllDepts: (all: boolean) => void;
  customDept: string;
  setCustomDept: (v: string) => void;
  addCustomDept: () => void;
}

export function Step2Departments(p: Step2Props) {
  const customId = useId();
  const count = p.selectedDepts.size;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold" aria-live="polite">
          {count === 0 ? "None selected" : `${count} selected`}
        </p>
        <div className="flex gap-4 text-sm font-medium">
          <button type="button" onClick={() => p.setAllDepts(true)} className="text-[#1B4D3E] underline decoration-[#1B4D3E]/30 underline-offset-4 hover:decoration-[#1B4D3E]">
            Select all
          </button>
          <button type="button" onClick={() => p.setAllDepts(false)} className="text-[#10231D]/70 underline decoration-[#10231D]/20 underline-offset-4 hover:decoration-[#10231D]/60">
            Clear
          </button>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {p.departments.map((dept) => {
          const on = p.selectedDepts.has(dept);
          return (
            <li key={dept}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => p.toggleDept(dept)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E] ${
                  on ? "border-[#1B4D3E] bg-[#DCEBE2]" : "border-transparent bg-white hover:border-[#10231D]/25"
                }`}
              >
                <TickBox checked={on} />
                {dept}
              </button>
            </li>
          );
        })}
      </ul>

      <div>
        <label htmlFor={customId} className="mb-1.5 block text-sm font-semibold">
          Not listed? Add your own
        </label>
        <div className="flex gap-3">
          <input
            id={customId}
            type="text"
            value={p.customDept}
            onChange={(e) => p.setCustomDept(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                p.addCustomDept();
              }
            }}
            placeholder="e.g. Customer support"
            className={controlClass}
          />
          <button
            type="button"
            onClick={p.addCustomDept}
            disabled={!p.customDept.trim()}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#10231D] px-5 text-base font-semibold text-[#F6F3EA] transition-colors hover:bg-[#1B4D3E] disabled:opacity-40"
          >
            <Plus className="h-5 w-5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Team
// ---------------------------------------------------------------------------

interface Step3Props {
  invitations: Array<{ email: string; role: string }>;
  errors: Record<number, string>;
  addInvitation: () => void;
  removeInvitation: (index: number) => void;
  updateInvitation: (index: number, field: "email" | "role", value: string) => void;
}

export function Step3Team({ invitations, errors, addInvitation, removeInvitation, updateInvitation }: Step3Props) {
  return (
    <div className="space-y-5">
      <ul className="space-y-4">
        {invitations.map((inv, idx) => (
          <li key={idx}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1">
                <input
                  type="email"
                  aria-label={`Email of person ${idx + 1}`}
                  autoFocus={idx === 0}
                  value={inv.email}
                  onChange={(e) => updateInvitation(idx, "email", e.target.value)}
                  placeholder="colleague@company.com"
                  aria-invalid={!!errors[idx]}
                  className={`${controlClass} ${errors[idx] ? "!border-[#C0392B]" : ""}`}
                />
                {errors[idx] && <p role="alert" className="mt-1.5 text-sm font-medium text-[#B02F22]">{errors[idx]}</p>}
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 sm:w-40 sm:flex-none">
                  <select
                    aria-label={`Role of person ${idx + 1}`}
                    value={inv.role}
                    onChange={(e) => updateInvitation(idx, "role", e.target.value)}
                    className={`${controlClass} appearance-none pr-4`}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                {invitations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInvitation(idx)}
                    aria-label={`Remove person ${idx + 1}`}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[#10231D]/60 hover:bg-[#F7D9D4] hover:text-[#B02F22]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addInvitation}
        className="inline-flex items-center gap-2 text-base font-semibold text-[#1B4D3E] underline decoration-[#1B4D3E]/30 underline-offset-4 hover:decoration-[#1B4D3E]"
      >
        <Plus className="h-5 w-5" /> Add another person
      </button>

      <p className="rounded-xl bg-white px-4 py-3.5 text-sm text-[#10231D]/70">
        <span className="font-semibold text-[#10231D]">Roles:</span> Employees see their own records. Managers also see their team.
        HR admins manage people and policies. Admins can change everything.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Modules
// ---------------------------------------------------------------------------

export interface ModuleChoice {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  selected: boolean;
  plan_tier: string;
  total_seats: number;
}

interface Step4Props {
  modules: ModuleChoice[];
  toggleModule: (id: number) => void;
  updateModulePlan: (id: number, plan_tier: string) => void;
  updateModuleSeats: (id: number, total_seats: number) => void;
  skipTrial: boolean;
  setSkipTrial: (v: boolean) => void;
}

export function Step4Modules(p: Step4Props) {
  if (p.modules.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-14 text-center">
        <Package className="mx-auto h-10 w-10 text-[#10231D]/40" />
        <p className="mt-3 text-lg font-semibold">No modules are available right now</p>
        <p className="mt-1 text-base text-[#10231D]/65">You can subscribe to modules later from the Modules page.</p>
      </div>
    );
  }

  const selected = p.modules.filter((m) => m.selected).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4">
        <div>
          <p className="text-base font-semibold">Start with a 14-day free trial</p>
          <p className="mt-0.5 text-sm text-[#10231D]/65">
            Turn this off to start paid subscriptions right away. An invoice is created for each module.
          </p>
        </div>
        <Toggle checked={!p.skipTrial} onChange={(on) => p.setSkipTrial(!on)} label="Start with a 14-day free trial" />
      </div>

      <p
        className={`text-base font-semibold ${selected === 0 ? "text-[#8A5A00]" : ""}`}
        aria-live="polite"
      >
        {selected === 0 ? "Choose at least one module to continue." : `${selected} module${selected > 1 ? "s" : ""} selected`}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {p.modules.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl border-2 transition-colors ${m.selected ? "border-[#1B4D3E] bg-[#DCEBE2]" : "border-transparent bg-white"} ${
              m.selected ? "sm:col-span-2" : ""
            }`}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={m.selected}
              onClick={() => p.toggleModule(m.id)}
              className="flex w-full items-start gap-3 rounded-2xl p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E]"
            >
              <span className="mt-0.5">
                <TickBox checked={m.selected} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold" style={DISPLAY}>
                  {m.name}
                </span>
                {m.description && <span className="mt-0.5 line-clamp-2 block text-sm text-[#10231D]/65">{m.description}</span>}
              </span>
            </button>
            {m.selected && (
              <div className="grid gap-4 px-4 pb-4 pl-[52px] sm:grid-cols-2">
                <SelectField label="Plan" value={m.plan_tier} onChange={(e) => p.updateModulePlan(m.id, e.target.value)}>
                  {PLAN_TIERS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </SelectField>
                <div>
                  <p className="mb-1.5 text-sm font-semibold">Licenses</p>
                  <NumberStepper label={`${m.name} licenses`} value={m.total_seats} min={1} max={10000} onChange={(v) => p.updateModuleSeats(m.id, v)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Leave and working hours
// ---------------------------------------------------------------------------

interface Step5Props {
  leaveTypes: Array<{ name: string; code: string; annual_quota: number; enabled: boolean; description?: string }>;
  toggleLeaveType: (index: number) => void;
  updateLeaveQuota: (index: number, quota: number) => void;
  shiftName: string; setShiftName: (v: string) => void;
  shiftStart: string; setShiftStart: (v: string) => void;
  shiftEnd: string; setShiftEnd: (v: string) => void;
  workDays: string;
}

export function Step5Setup(p: Step5Props) {
  const { t } = useTranslation();
  const nameId = useId();
  const startId = useId();
  const endId = useId();

  return (
    <div className="space-y-10">
      <section aria-labelledby="leave-h">
        <h3 id="leave-h" className="text-xl font-bold tracking-[-0.01em]" style={DISPLAY}>
          Leave types
        </h3>
        <p className="mt-1 text-base text-[#10231D]/65">Turn on the leave your company gives, and set the days per year.</p>
        <ul className="mt-4 space-y-3">
          {p.leaveTypes.map((lt, idx) => (
            <li
              key={lt.code}
              className={`flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl bg-white px-5 py-4 transition-opacity ${lt.enabled ? "" : "opacity-60"}`}
            >
              <Toggle checked={lt.enabled} onChange={() => p.toggleLeaveType(idx)} label={`Enable ${leaveTypeLabel(t, lt)}`} />
              <div className="min-w-[10rem] flex-1">
                <p className="text-base font-semibold">{leaveTypeLabel(t, lt)}</p>
                {lt.description && <p className="text-sm text-[#10231D]/60">{lt.description}</p>}
              </div>
              <div className="flex items-center gap-2.5">
                <NumberStepper label={`${leaveTypeLabel(t, lt)} days per year`} value={lt.annual_quota} min={0} max={365} disabled={!lt.enabled} onChange={(v) => p.updateLeaveQuota(idx, v)} />
                <span className="text-sm text-[#10231D]/60">days / year</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shift-h">
        <h3 id="shift-h" className="text-xl font-bold tracking-[-0.01em]" style={DISPLAY}>
          Working hours
        </h3>
        <p className="mt-1 text-base text-[#10231D]/65">The default shift for your team.</p>
        <div className="mt-4 grid gap-5 rounded-2xl bg-white p-5 sm:grid-cols-3">
          <Field label="Shift name" htmlFor={nameId} className="sm:col-span-3">
            <input id={nameId} type="text" value={p.shiftName} onChange={(e) => p.setShiftName(e.target.value)} className={controlClass} />
          </Field>
          <Field label="Starts" htmlFor={startId}>
            <input id={startId} type="time" value={p.shiftStart} onChange={(e) => p.setShiftStart(e.target.value)} className={controlClass} />
          </Field>
          <Field label="Ends" htmlFor={endId}>
            <input id={endId} type="time" value={p.shiftEnd} onChange={(e) => p.setShiftEnd(e.target.value)} className={controlClass} />
          </Field>
          <div>
            <p className="mb-1.5 text-sm font-semibold">Working days</p>
            <p className="flex h-12 items-center rounded-xl bg-[#EEF1EC] px-4 text-base text-[#10231D]/75">{p.workDays}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

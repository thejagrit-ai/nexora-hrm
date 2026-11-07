import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import api from "@/api/client";
import { showToast } from "@/components/ui/Toast";
import NexoraLogo from "@/components/brand/NexoraLogo";
import { DISPLAY } from "@/components/auth/AuthShell";
import {
  Step1Company,
  Step2Departments,
  Step3Team,
  Step4Modules,
  Step5Setup,
  EMAIL_RE,
  type ModuleChoice,
} from "@/components/onboarding/steps";

// ---------------------------------------------------------------------------
// Types and constants
// ---------------------------------------------------------------------------

interface StepStatus {
  step: number;
  name: string;
  key: string;
  completed: boolean;
}

interface OnboardingStatus {
  completed: boolean;
  currentStep: number;
  steps: StepStatus[];
}

const STEPS = [
  { label: "Company", title: "Tell us about your company", help: "The basics we use to set up your workspace." },
  { label: "Departments", title: "Pick your departments", help: "Choose the teams you have. You can add or rename them later." },
  { label: "Team", title: "Invite your team", help: "They'll get an email to join. You can skip this and invite people later." },
  { label: "Modules", title: "Choose your modules", help: "Pick what you need now. You can add more at any time." },
  { label: "Leave and hours", title: "Set your leave and working hours", help: "Sensible defaults are filled in. Change anything you like." },
] as const;

const DEFAULT_DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Finance", "HR", "Operations"];

const DEFAULT_LEAVE_TYPES = [
  { name: "Earned Leave", code: "EL", annual_quota: 12, is_paid: true, is_carry_forward: true, max_carry_forward_days: 5, description: "Earned/privilege leave" },
  { name: "Casual Leave", code: "CL", annual_quota: 7, is_paid: true, is_carry_forward: false, description: "Casual leave for personal matters" },
  { name: "Sick Leave", code: "SL", annual_quota: 7, is_paid: true, is_carry_forward: false, description: "Medical/sick leave" },
];

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("en");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();

  // Step 2
  const [departments, setDepartments] = useState<string[]>([...DEFAULT_DEPARTMENTS]);
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set(["Engineering", "HR", "Finance"]));
  const [customDept, setCustomDept] = useState("");

  // Step 3
  const [invitations, setInvitations] = useState<Array<{ email: string; role: string }>>([{ email: "", role: "employee" }]);
  const [inviteErrors, setInviteErrors] = useState<Record<number, string>>({});

  // Step 4
  const [modules, setModules] = useState<ModuleChoice[]>([]);
  const [skipTrial, setSkipTrial] = useState(false);

  // Step 5
  const [leaveTypes, setLeaveTypes] = useState(DEFAULT_LEAVE_TYPES.map((lt) => ({ ...lt, enabled: true })));
  const [shiftName, setShiftName] = useState("General Shift");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const workDays = "Monday to Friday";

  // Resume where the admin left off
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/onboarding/status");
        const s = data.data as OnboardingStatus;
        if (s.completed) {
          navigate("/", { replace: true });
          return;
        }
        if (s.currentStep > 0 && s.currentStep < 5) setActiveStep(s.currentStep + 1);
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Pre-fill company details from registration
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/organizations/me");
        const org = data.data;
        if (org.name) setCompanyName(org.name);
        if (org.country) setCountry(org.country);
        if (org.state) setState(org.state || "");
        if (org.city) setCity(org.city || "");
        if (org.timezone) setTimezone(org.timezone);
        if (org.language) setLanguage(org.language);
      } catch {
        /* optional */
      }
    })();
  }, []);

  // Modules for step 4
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/modules");
        setModules(
          (data.data || []).map((m: any) => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
            description: m.description || "",
            icon: m.icon || "",
            selected: false,
            plan_tier: "basic",
            total_seats: 10,
          })),
        );
      } catch {
        /* optional */
      }
    })();
  }, []);

  const goTo = useCallback((newStep: number) => {
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(newStep);
      setAnimating(false);
      window.scrollTo({ top: 0 });
    }, 150);
  }, []);

  const selectedModuleCount = modules.filter((m) => m.selected).length;
  const moduleGate = activeStep === 4 && modules.length > 0 && selectedModuleCount === 0;

  const handleNext = async () => {
    // Checks that must pass before anything is saved
    if (activeStep === 1 && !companyName.trim()) {
      setNameError("Enter your company name.");
      return;
    }
    if (activeStep === 3) {
      const errs: Record<number, string> = {};
      invitations.forEach((inv, i) => {
        if (inv.email.trim() && !EMAIL_RE.test(inv.email.trim())) errs[i] = "Enter a valid email address.";
      });
      setInviteErrors(errs);
      if (Object.keys(errs).length) return;
    }
    if (moduleGate) {
      showToast("error", "Choose at least one module to continue.");
      return;
    }

    setSubmitting(true);
    try {
      let stepData: Record<string, any> = {};

      switch (activeStep) {
        case 1:
          // Logo upload is non-blocking: a failure is shown but doesn't hold up setup.
          if (logoFile) {
            try {
              const form = new FormData();
              form.append("logo", logoFile);
              await api.post("/organizations/me/logo", form, { headers: { "Content-Type": "multipart/form-data" } });
              setLogoError(null);
            } catch (err: any) {
              setLogoError(err?.response?.data?.error?.message || err?.message || "Logo upload failed");
            }
          }
          stepData = { name: companyName.trim(), country, state, city, timezone, language };
          break;
        case 2:
          stepData = { departments: Array.from(selectedDepts) };
          break;
        case 3:
          stepData = { invitations: invitations.filter((inv) => inv.email.trim()).map((inv) => ({ ...inv, email: inv.email.trim() })) };
          break;
        case 4:
          stepData = {
            modules: modules
              .filter((m) => m.selected)
              .map((m) => ({ module_id: m.id, plan_tier: m.plan_tier, total_seats: m.total_seats })),
            skip_trial: skipTrial,
          };
          break;
        case 5:
          stepData = {
            leave_types: leaveTypes.filter((lt) => lt.enabled),
            shift: {
              name: shiftName,
              start_time: shiftStart + ":00",
              end_time: shiftEnd + ":00",
              break_minutes: 60,
              grace_minutes_late: 15,
              grace_minutes_early: 15,
            },
          };
          break;
      }

      await api.post(`/onboarding/step/${activeStep}`, stepData);

      if (activeStep === 5) {
        await api.post("/onboarding/complete");
        navigate("/", { replace: true });
      } else {
        goTo(activeStep + 1);
      }
    } catch {
      // Setup stays non-blocking: tell the admin, then let them continue.
      showToast("error", "We couldn't save this step. You can update it later in Settings.");
      if (activeStep < 5) goTo(activeStep + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => activeStep > 1 && goTo(activeStep - 1);

  // Departments
  const toggleDept = (name: string) =>
    setSelectedDepts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  const setAllDepts = (all: boolean) => setSelectedDepts(all ? new Set(departments) : new Set());
  const addCustomDept = () => {
    const name = customDept.trim();
    if (!name) return;
    if (departments.some((d) => d.toLowerCase() === name.toLowerCase())) {
      showToast("error", `${name} is already in the list.`);
      return;
    }
    setDepartments((prev) => [...prev, name]);
    setSelectedDepts((prev) => new Set([...prev, name]));
    setCustomDept("");
  };

  // Invitations
  const addInvitation = () => setInvitations((prev) => [...prev, { email: "", role: "employee" }]);
  const removeInvitation = (index: number) => {
    setInvitations((prev) => prev.filter((_, i) => i !== index));
    setInviteErrors({});
  };
  const updateInvitation = (index: number, field: "email" | "role", value: string) => {
    setInvitations((prev) => prev.map((inv, i) => (i === index ? { ...inv, [field]: value } : inv)));
    setInviteErrors((prev) => {
      const { [index]: _drop, ...rest } = prev;
      return rest;
    });
  };

  // Modules and leave
  const toggleModule = (id: number) => setModules((prev) => prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  const toggleLeaveType = (i: number) => setLeaveTypes((prev) => prev.map((lt, idx) => (idx === i ? { ...lt, enabled: !lt.enabled } : lt)));
  const updateLeaveQuota = (i: number, quota: number) => setLeaveTypes((prev) => prev.map((lt, idx) => (idx === i ? { ...lt, annual_quota: quota } : lt)));

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#EEF1EC]" role="status" aria-label="Loading setup">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B4D3E]" />
      </div>
    );
  }

  const step = STEPS[activeStep - 1];
  const emptyInvites = activeStep === 3 && invitations.every((i) => !i.email.trim());

  return (
    <div
      className="min-h-dvh bg-[#EEF1EC] text-[#10231D] lg:grid lg:grid-cols-[340px_1fr]"
      style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif", colorScheme: "light" }}
    >
      {/* Sidebar (desktop): where you are */}
      <aside className="hidden h-dvh flex-col bg-[#1B4D3E] px-9 py-10 lg:sticky lg:top-0 lg:flex">
        <NexoraLogo tone="light" size={44} />
        <nav aria-label="Setup progress" className="mt-14">
          <ol className="space-y-1">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = n < activeStep;
              const current = n === activeStep;
              return (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => done && !submitting && goTo(n)}
                    disabled={!done}
                    aria-current={current ? "step" : undefined}
                    className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${
                      current ? "bg-[#F6F3EA]/10" : done ? "hover:bg-[#F6F3EA]/10" : ""
                    } disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F4B63F]`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base font-bold ${
                        done ? "bg-[#2E9E6B] text-white" : current ? "bg-[#F4B63F] text-[#10231D]" : "bg-[#F6F3EA]/15 text-[#F6F3EA]/70"
                      }`}
                      style={DISPLAY}
                    >
                      {done ? <Check className="h-5 w-5" strokeWidth={3} /> : n}
                    </span>
                    <span className={`text-base ${current ? "font-bold text-[#F6F3EA]" : done ? "font-medium text-[#F6F3EA]/90" : "text-[#F6F3EA]/60"}`}>
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <p className="mt-auto text-base leading-relaxed text-[#F6F3EA]/75">
          About three minutes. Everything here can be changed later in Settings.
        </p>
      </aside>

      <div className="flex min-h-dvh flex-col lg:min-h-0">
        {/* Progress (mobile) */}
        <header className="bg-[#1B4D3E] px-5 py-4 text-[#F6F3EA] lg:hidden">
          <div className="flex items-center justify-between">
            <NexoraLogo tone="light" size={32} />
            <p className="text-sm font-semibold" aria-live="polite">
              Step {activeStep} of {STEPS.length}
            </p>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < activeStep ? "bg-[#F4B63F]" : "bg-[#F6F3EA]/20"}`} />
            ))}
          </div>
        </header>

        <form
          className="flex flex-1 flex-col"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!submitting) handleNext();
          }}
        >
          <main className="flex-1 px-5 py-8 sm:px-10 lg:px-16 lg:py-14">
            <div
              className={`mx-auto max-w-[720px] transition-all duration-150 ease-out motion-reduce:transition-none ${
                animating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <p className="text-sm font-semibold text-[#1B4D3E]/80 lg:hidden">{step.label}</p>
              <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[40px]" style={DISPLAY}>
                {step.title}
              </h1>
              <p className="mt-3 max-w-[56ch] text-lg text-[#10231D]/70">{step.help}</p>

              <div className="mt-9">
                {activeStep === 1 && (
                  <Step1Company
                    companyName={companyName}
                    setCompanyName={(v) => (setCompanyName(v), setNameError(undefined))}
                    nameError={nameError}
                    country={country}
                    setCountry={setCountry}
                    state={state}
                    setState={setState}
                    city={city}
                    setCity={setCity}
                    timezone={timezone}
                    setTimezone={setTimezone}
                    language={language}
                    setLanguage={setLanguage}
                    logoFile={logoFile}
                    logoPreview={logoPreview}
                    logoError={logoError}
                    onLogoSelected={(file, preview) => {
                      setLogoFile(file);
                      setLogoPreview(preview);
                      setLogoError(null);
                    }}
                    onLogoCleared={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      setLogoError(null);
                    }}
                  />
                )}
                {activeStep === 2 && (
                  <Step2Departments
                    departments={departments}
                    selectedDepts={selectedDepts}
                    toggleDept={toggleDept}
                    setAllDepts={setAllDepts}
                    customDept={customDept}
                    setCustomDept={setCustomDept}
                    addCustomDept={addCustomDept}
                  />
                )}
                {activeStep === 3 && (
                  <Step3Team
                    invitations={invitations}
                    errors={inviteErrors}
                    addInvitation={addInvitation}
                    removeInvitation={removeInvitation}
                    updateInvitation={updateInvitation}
                  />
                )}
                {activeStep === 4 && (
                  <Step4Modules
                    modules={modules}
                    toggleModule={toggleModule}
                    updateModulePlan={(id, plan_tier) => setModules((prev) => prev.map((m) => (m.id === id ? { ...m, plan_tier } : m)))}
                    updateModuleSeats={(id, total_seats) => setModules((prev) => prev.map((m) => (m.id === id ? { ...m, total_seats } : m)))}
                    skipTrial={skipTrial}
                    setSkipTrial={setSkipTrial}
                  />
                )}
                {activeStep === 5 && (
                  <Step5Setup
                    leaveTypes={leaveTypes}
                    toggleLeaveType={toggleLeaveType}
                    updateLeaveQuota={updateLeaveQuota}
                    shiftName={shiftName}
                    setShiftName={setShiftName}
                    shiftStart={shiftStart}
                    setShiftStart={setShiftStart}
                    shiftEnd={shiftEnd}
                    setShiftEnd={setShiftEnd}
                    workDays={workDays}
                  />
                )}
              </div>
            </div>
          </main>

          {/* Action bar: always visible */}
          <footer className="sticky bottom-0 bg-[#E2E8E0] px-5 py-4 sm:px-10 lg:px-16">
            <div className="mx-auto flex max-w-[720px] items-center justify-between gap-4">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={submitting}
                  className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-base font-semibold text-[#10231D]/80 hover:text-[#10231D] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4D3E]"
                >
                  <ArrowLeft className="h-5 w-5" /> Back
                </button>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={submitting || moduleGate}
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#F4B63F] px-7 text-base font-bold text-[#10231D] transition-[background-color,transform] hover:bg-[#EAA724] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10231D]"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : activeStep === 5 ? (
                  <Sparkles className="h-5 w-5" />
                ) : null}
                {activeStep === 5 ? "Finish setup" : emptyInvites ? "Skip for now" : "Continue"}
                {activeStep < 5 && !submitting && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

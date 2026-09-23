import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@empcloud/shared";
import { useRegister } from "@/api/hooks";
import { useAuthStore } from "@/lib/auth-store";
import {
  Eye,
  EyeOff,
  Building2,
  User,
  Mail,
  Lock,
  Globe,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Layers,
  Clock,
  CreditCard,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const setAuth = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { org_country: "IN", org_state: "Karnataka" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    try {
      const result = await registerMutation.mutateAsync(data);
      setAuth(
        {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          role: result.user.role,
          org_id: result.org.id,
          org_name: result.org.name,
        },
        result.tokens
      );
      navigate("/onboarding");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          t("registerPage.error.registrationFailed")
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans">
      {/* LEFT VISUAL HERO (Desktop/Tablet lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-6/12 relative overflow-hidden bg-slate-950 text-white p-12 flex-col justify-between select-none">
        {/* Background Radial Glow & Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Watermark & Status Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">Nexora HRM</span>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Cloud Suite</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 text-xs font-medium text-slate-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Instant Workspace Provisioning</span>
          </div>
        </div>

        {/* Centerpiece Feature List */}
        <div className="relative z-10 my-auto py-8 max-w-xl mx-auto w-full space-y-6">
          <div className="space-y-3 mb-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Layers className="w-4 h-4 text-indigo-400" />
              Enterprise Setup in 2 Minutes
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Register Your Organization Workspace
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Get full access to multi-tenant HR tools, automated payroll compliance, employee attendance, and AI-powered HR workflows.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Multi-Tenant Organization Core</h4>
                <p className="text-xs text-slate-400 mt-0.5">Isolated tenant databases, customizable department hierarchies, and custom fields.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Indian Statutory Payroll Engine</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pre-configured EPF, ESI, Labour Welfare Fund (LWF), and Professional Tax (PT) calculations.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Smart Attendance & Geofencing</h4>
                <p className="text-xs text-slate-400 mt-0.5">Biometric integration, mobile check-in with GPS verification, and automated shift rosters.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted • ISO-27001 Ready</span>
          </div>
          <span className="font-mono text-[11px]">v2.6 Enterprise</span>
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM PANEL */}
      <div className="w-full lg:w-1/2 xl:w-6/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 relative bg-background border-l border-border/40 shadow-2xl overflow-y-auto">
        {/* Top Controls Header */}
        <div className="flex items-center justify-between w-full">
          {/* Mobile Logo Branding */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              N
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              NEXORA HR
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Register Form Box */}
        <div className="max-w-[540px] w-full mx-auto my-auto space-y-6 py-6">
          {/* Brand Header */}
          <div className="space-y-1.5 text-left">
            <div className="hidden lg:flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                N
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NEXORA HR
                </span>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  People. Process. Performance.
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("registerPage.header.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("registerPage.header.subtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Organization Details */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {t("registerPage.section.organization")}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {t("registerPage.field.companyName.label")}
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <input
                      {...register("org_name")}
                      className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                      placeholder={t("registerPage.field.companyName.placeholder")}
                    />
                  </div>
                  {errors.org_name && (
                    <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.org_name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {t("registerPage.field.country.label")}
                    </label>
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                      <input
                        {...register("org_country")}
                        className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                        placeholder="IN"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {t("registerPage.field.state.label")}
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                      <input
                        {...register("org_state")}
                        className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                        placeholder="Karnataka"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Section 2: Admin Account Credentials */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t("registerPage.section.adminAccount")}
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {t("registerPage.field.firstName.label")}
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                      <input
                        {...register("first_name")}
                        className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                        placeholder="Ananya"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {t("registerPage.field.lastName.label")}
                    </label>
                    <input
                      {...register("last_name")}
                      className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full px-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                      placeholder="Gupta"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {t("registerPage.field.email.label")}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <input
                      type="email"
                      {...register("email")}
                      className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                      placeholder={t("registerPage.field.email.placeholder")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {t("registerPage.field.password.label")}
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-10 pr-10 py-2.5 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                      placeholder={t("registerPage.field.password.placeholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 text-muted-foreground/70 hover:text-foreground transition-colors p-1"
                      aria-label={
                        showPassword
                          ? t("registerPage.password.hideAriaLabel")
                          : t("registerPage.password.showAriaLabel")
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 px-5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99] text-base mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("registerPage.submit.creating")}</span>
                </>
              ) : (
                <>
                  <span>{t("registerPage.submit.default")}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Footer Link */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
              {t("registerPage.footer.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
              >
                {t("registerPage.footer.signIn")}
              </Link>
            </p>
          </form>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center text-[11px] text-muted-foreground/60 py-2">
          <span>Protected by Enterprise Security • 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}

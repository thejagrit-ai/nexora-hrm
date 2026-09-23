import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@empcloud/shared";
import { useLogin } from "@/api/hooks";
import { useAuthStore } from "@/lib/auth-store";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  CreditCard,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Layers,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getPaymentRestrictionDestination } from "@/lib/organization-access";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const setAuth = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Set by the API client's forceLogout() helper when session is unrecoverable
  const [searchParams] = useSearchParams();
  const sessionState = searchParams.get("session"); // "expired" or null
  const justReset = searchParams.get("reset") === "success";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    try {
      const result = await login.mutateAsync(data);
      const authUser = {
        id: result.user.id,
        email: result.user.email,
        first_name: result.user.first_name,
        last_name: result.user.last_name,
        role: result.user.role,
        org_id: result.org?.id ?? result.user.organization_id ?? 0,
        org_name: result.org?.name ?? "NEXORA HR Platform",
        payment_restricted: Boolean(result.payment_restricted),
      };
      setAuth(authUser, result.tokens);
      navigate(
        authUser.payment_restricted
          ? getPaymentRestrictionDestination(authUser)
          : "/",
      );
    } catch (err: any) {
      if (err.response?.status === 429) {
        const retryAfterSec = Number(err.response.headers?.["retry-after"]);
        const baseMsg =
          err.response?.data?.error?.message ||
          "Too many login attempts. Please wait and try again.";
        if (retryAfterSec > 0) {
          const mins = Math.ceil(retryAfterSec / 60);
          setError(`${baseMsg} (Retry in ~${mins} min)`);
        } else {
          setError(baseMsg);
        }
        return;
      }
      const apiMsg = err.response?.data?.error?.message;
      const networkMsg = !err.response
        ? "Can't reach the server. Check your connection and try again."
        : null;
      setError(apiMsg || networkMsg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans">
      {/* LEFT VISUAL AREA (Desktop / Tablet lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden bg-slate-950 text-white p-12 flex-col justify-between select-none">
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
            <span>Multi-Tenant Active</span>
          </div>
        </div>

        {/* Centerpiece Hero Section with Glassmorphism Cards */}
        <div className="relative z-10 my-auto py-12 max-w-xl mx-auto w-full space-y-6">
          <div className="space-y-3 mb-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Layers className="w-4 h-4 text-indigo-400" />
              Next-Gen Workforce Management
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent People Platform for Global Teams
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Streamline employee lifecycle, automated payroll, geofenced biometrics, performance KPIs, and multi-state statutory compliance.
            </p>
          </div>

          {/* Floating HR Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Attendance */}
            <div className="animate-float-slow bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  98.4% On-Time
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-300">Biometric Attendance</h4>
              <p className="text-lg font-bold text-white mt-0.5">Live Shift Sync</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Real-time GPS Geofencing</span>
              </div>
            </div>

            {/* Card 2: Payroll */}
            <div className="animate-float-medium bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  PF / ESI Ready
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-300">Statutory Payroll</h4>
              <p className="text-lg font-bold text-white mt-0.5">₹48,50,000</p>
              <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[100%]" />
              </div>
            </div>

            {/* Card 3: Performance */}
            <div className="animate-float-reverse bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Q3 Milestone
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-300">Performance & KPIs</h4>
              <p className="text-lg font-bold text-white mt-0.5">94.2% Rating</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Goals Achieved</span>
              </div>
            </div>

            {/* Card 4: Staff Directory */}
            <div className="animate-float-slow bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-pink-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  Active Staff
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-300">Workplace Roster</h4>
              <p className="text-lg font-bold text-white mt-0.5">425 Employees</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-950 bg-indigo-500 text-[9px] font-bold text-white text-center leading-5">AG</span>
                  <span className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-950 bg-purple-500 text-[9px] font-bold text-white text-center leading-5">RS</span>
                  <span className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-950 bg-pink-500 text-[9px] font-bold text-white text-center leading-5">PP</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">+422 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC-2 Type II Certified • POSH Compliant</span>
          </div>
          <span className="font-mono text-[11px]">v2.6 Enterprise</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative bg-background border-l border-border/40 shadow-2xl overflow-y-auto">
        {/* Top Header Controls Bar */}
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

        {/* Main Form Box (Increased width max-w-[500px]) */}
        <div className="max-w-[500px] w-full mx-auto my-auto space-y-7 py-8">
          {/* Brand Header */}
          <div className="space-y-2 text-left">
            <div className="hidden lg:flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                N
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NEXORA HR
                </span>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  People. Process. Performance.
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("auth.signIn")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to continue to your HR workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {sessionState === "expired" && !error && (
              <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs sm:text-sm px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}
            {sessionState === "blocked" && !error && (
              <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Login has been disabled for this organization. Contact support.</span>
              </div>
            )}
            {justReset && !error && (
              <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Password updated. Sign in with your new password.</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                {t("auth.email")}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-muted-foreground/70 pointer-events-none" />
                <input
                  type="email"
                  {...register("email")}
                  className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-12 pr-4 py-3 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  {t("auth.password")}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-muted-foreground/70 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="bg-card text-foreground placeholder:text-muted-foreground/50 w-full pl-12 pr-12 py-3 rounded-xl border border-border text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-200"
                  placeholder={t("auth.password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-muted-foreground/70 hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 px-5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99] text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("auth.signingIn")}</span>
                </>
              ) : (
                <>
                  <span>{t("auth.signIn")}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground pt-3">
              {t("auth.noAccount")}{" "}
              <Link
                to="/register"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
              >
                {t("auth.registerOrg")}
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

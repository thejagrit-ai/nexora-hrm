import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@empcloud/shared";
import { useLogin } from "@/api/hooks";
import { useAuthStore } from "@/lib/auth-store";
import { ArrowRight, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import AuthShell, { DISPLAY } from "@/components/auth/AuthShell";
import LoginBadge, { nameFromEmail, type BadgeStatus } from "@/components/auth/LoginBadge";
import { TextField, SubmitButton } from "@/components/auth/TextField";
import { getPaymentRestrictionDestination } from "@/lib/organization-access";

const notice = "flex items-start gap-3 rounded-xl px-4 py-3.5 text-[15px]";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const setAuth = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [granted, setGranted] = useState(false);

  const [searchParams] = useSearchParams();
  const sessionState = searchParams.get("session");
  const justReset = searchParams.get("reset") === "success";

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const email = watch("email") ?? "";
  const password = watch("password") ?? "";
  const status: BadgeStatus = granted ? "granted" : isSubmitting ? "verifying" : error ? "denied" : "idle";

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
      setGranted(true);
      setAuth(authUser, result.tokens);
      navigate(authUser.payment_restricted ? getPaymentRestrictionDestination(authUser) : "/");
    } catch (err: any) {
      if (err.response?.status === 429) {
        const retryAfterSec = Number(err.response.headers?.["retry-after"]);
        const baseMsg =
          err.response?.data?.error?.message || "Too many login attempts. Please wait and try again.";
        if (retryAfterSec > 0) {
          setError(`${baseMsg} (Retry in ~${Math.ceil(retryAfterSec / 60)} min)`);
        } else {
          setError(baseMsg);
        }
        return;
      }
      const apiMsg = err.response?.data?.error?.message;
      const networkMsg = !err.response ? "Can't reach the server. Check your connection and try again." : null;
      setError(apiMsg || networkMsg || "Login failed. Please try again.");
    }
  };

  return (
    <AuthShell
      headline="Your team's day starts here."
      badge={<LoginBadge name={nameFromEmail(email)} subline={email} passwordLength={password.length} status={status} />}
    >
      <h1 className="text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
        {t("auth.signIn")}
      </h1>
      <p className="mt-4 text-lg text-[#10231D]/70">Use your work email to open your workspace.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-6" noValidate>
        {sessionState === "expired" && !error && (
          <div className={`${notice} bg-[#FBEBC6] text-[#5C4310]`} role="status">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>Your session expired. Sign in again to continue.</span>
          </div>
        )}
        {sessionState === "blocked" && !error && (
          <div className={`${notice} bg-[#F7D9D4] text-[#7A1F14]`} role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>Sign-in is turned off for this organization. Contact support.</span>
          </div>
        )}
        {justReset && !error && (
          <div className={`${notice} bg-[#D5ECDF] text-[#1B4D3E]`} role="status">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>Password updated. Sign in with your new password.</span>
          </div>
        )}
        {error && (
          <div className={`${notice} bg-[#F7D9D4] text-[#7A1F14]`} role="alert">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <TextField
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label={t("auth.password")}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          labelAction={
            <Link
              to="/forgot-password"
              className="text-[15px] font-medium text-[#1B4D3E] underline decoration-[#1B4D3E]/30 underline-offset-4 hover:decoration-[#1B4D3E]"
            >
              {t("auth.forgotPassword")}
            </Link>
          }
          {...register("password")}
        />

        <SubmitButton busy={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t("auth.signingIn")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.signIn")}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </SubmitButton>
      </form>

      <p className="mt-9 text-base text-[#10231D]/70">
        {t("auth.noAccount")}{" "}
        <Link
          to="/register"
          className="font-semibold text-[#10231D] underline decoration-[#F4B63F] decoration-[3px] underline-offset-4 hover:decoration-[#10231D]"
        >
          {t("auth.registerOrg")}
        </Link>
      </p>
    </AuthShell>
  );
}

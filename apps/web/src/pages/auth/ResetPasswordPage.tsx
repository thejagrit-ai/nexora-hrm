import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@empcloud/shared";
import { useResetPassword } from "@/api/hooks";
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import AuthShell, { DISPLAY } from "@/components/auth/AuthShell";
import LoginBadge, { type BadgeStatus } from "@/components/auth/LoginBadge";
import { TextField, SubmitButton } from "@/components/auth/TextField";
import PasswordStrength from "@/components/auth/PasswordStrength";

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(
      resetPasswordSchema.pick({ password: true }).extend({ confirmPassword: resetPasswordSchema.shape.password }),
    ),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password") ?? "";
  const confirm = watch("confirmPassword") ?? "";
  const mismatch = !!confirm && password !== confirm;
  const status: BadgeStatus = done ? "granted" : isSubmitting ? "verifying" : error ? "denied" : "idle";

  const onSubmit = async (data: FormValues) => {
    setError("");
    if (data.password !== data.confirmPassword) {
      setError(t("auth.passwordsDontMatch"));
      return;
    }
    if (!token) {
      setError(t("auth.missingResetToken"));
      return;
    }
    try {
      const payload: ResetPasswordInput = { token, password: data.password };
      await reset.mutateAsync(payload);
      setDone(true);
      navigate("/login?reset=success", { replace: true });
    } catch (err: any) {
      setError(
        !err.response
          ? "Can't reach the server. Check your connection and try again."
          : err.response?.data?.error?.message || "Couldn't reset the password. Request a new link and try again.",
      );
    }
  };

  const badge = (
    <LoginBadge
      name=""
      subline=""
      placeholderName="New password"
      placeholderSubline="Choose one you don't use elsewhere"
      passwordLength={password.length}
      status={status}
      labels={{ idle: "Badge on hold", verifying: "Updating…", granted: "Password updated", denied: "Not updated" }}
    />
  );

  return (
    <AuthShell headline="Choose a new password." badge={badge}>
      {!token ? (
        <div role="alert">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#FBEBC6] text-[#5C4310]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
            This link is incomplete
          </h1>
          <p className="mt-4 text-lg text-[#10231D]/70">{t("auth.missingResetToken")}</p>
          <Link
            to="/forgot-password"
            className="mt-9 inline-flex items-center gap-2 text-base font-semibold text-[#10231D] underline decoration-[#F4B63F] decoration-[3px] underline-offset-4 hover:decoration-[#10231D]"
          >
            Request a new link <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
            {t("auth.resetPasswordTitle")}
          </h1>
          <p className="mt-4 text-lg text-[#10231D]/70">Pick a password you don't use anywhere else.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-6" noValidate>
            <div>
              <TextField
                label={t("auth.newPassword")}
                type="password"
                autoComplete="new-password"
                autoFocus
                placeholder="New password"
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordStrength password={password} />
            </div>

            <TextField
              label={t("auth.confirmPassword")}
              type="password"
              autoComplete="new-password"
              placeholder="Type it again"
              error={errors.confirmPassword?.message ?? (mismatch ? t("auth.passwordsDontMatch") : undefined)}
              {...register("confirmPassword")}
            />

            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-[#F7D9D4] px-4 py-3.5 text-[15px] text-[#7A1F14]" role="alert">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <SubmitButton busy={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("auth.resettingPassword")}</span>
                </>
              ) : (
                <>
                  <span>{t("auth.resetPassword")}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </SubmitButton>
          </form>

          <Link
            to="/login"
            className="mt-9 inline-flex items-center gap-2 text-base font-semibold text-[#10231D] underline decoration-[#F4B63F] decoration-[3px] underline-offset-4 hover:decoration-[#10231D]"
          >
            <ArrowLeft className="h-5 w-5" /> {t("auth.backToLogin")}
          </Link>
        </>
      )}
    </AuthShell>
  );
}

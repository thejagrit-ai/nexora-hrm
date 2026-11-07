import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@empcloud/shared";
import { useForgotPassword } from "@/api/hooks";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, MailCheck } from "lucide-react";
import AuthShell, { DISPLAY } from "@/components/auth/AuthShell";
import LoginBadge, { nameFromEmail, type BadgeStatus } from "@/components/auth/LoginBadge";
import { TextField, SubmitButton } from "@/components/auth/TextField";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgot = useForgotPassword();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const email = watch("email") ?? "";
  const status: BadgeStatus = sentTo ? "granted" : isSubmitting ? "verifying" : error ? "denied" : "idle";

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError("");
    try {
      await forgot.mutateAsync(data);
      setSentTo(data.email);
    } catch (err: any) {
      // The API answers 200 even for unknown emails, so only network,
      // validation and rate-limit problems reach this branch.
      setError(
        !err.response
          ? "Can't reach the server. Check your connection and try again."
          : err.response?.data?.error?.message || "Couldn't send the reset link. Try again.",
      );
    }
  };

  const back = (
    <Link
      to="/login"
      className="inline-flex items-center gap-2 text-base font-semibold text-[#10231D] underline decoration-[#F4B63F] decoration-[3px] underline-offset-4 hover:decoration-[#10231D]"
    >
      <ArrowLeft className="h-5 w-5" /> {t("auth.backToLogin")}
    </Link>
  );

  return (
    <AuthShell
      headline="Locked out? Back in a minute."
      badge={
        <LoginBadge
          name={nameFromEmail(email)}
          subline={email}
          passwordLength={0}
          status={status}
          labels={{ idle: "Badge on hold", verifying: "Sending link…", granted: "Reset link sent", denied: "Link not sent" }}
        />
      }
    >
      {sentTo ? (
        <div role="status">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1B4D3E] text-[#F4B63F]">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
            Check your email
          </h1>
          <p className="mt-4 text-lg text-[#10231D]/70">
            If <span className="break-all font-semibold text-[#10231D]">{sentTo}</span> has an account, we sent a link to
            choose a new password. It works for one hour.
          </p>
          <p className="mt-3 text-base text-[#10231D]/70">Nothing yet? Check spam, or try again with a different address.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            {back}
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="text-base font-medium text-[#1B4D3E] underline decoration-[#1B4D3E]/30 underline-offset-4 hover:decoration-[#1B4D3E]"
            >
              Use a different email
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
            {t("auth.forgotPasswordTitle")}
          </h1>
          <p className="mt-4 text-lg text-[#10231D]/70">
            Enter your work email and we'll send you a link to set a new password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-6" noValidate>
            <TextField
              label={t("auth.email")}
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email")}
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
                  <span>{t("auth.sendingResetLink")}</span>
                </>
              ) : (
                <>
                  <span>{t("auth.sendResetLink")}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </SubmitButton>
          </form>

          <div className="mt-9">{back}</div>
        </>
      )}
    </AuthShell>
  );
}

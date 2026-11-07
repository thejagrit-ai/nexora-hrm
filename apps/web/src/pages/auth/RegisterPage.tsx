import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@empcloud/shared";
import { useRegister } from "@/api/hooks";
import { useAuthStore } from "@/lib/auth-store";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import AuthShell, { DISPLAY } from "@/components/auth/AuthShell";
import LoginBadge, { titleCase, type BadgeStatus } from "@/components/auth/LoginBadge";
import { TextField, SubmitButton } from "@/components/auth/TextField";
import PasswordStrength from "@/components/auth/PasswordStrength";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const setAuth = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { org_country: "IN", org_state: "Karnataka" },
  });

  const password = watch("password", "") ?? "";
  const first = watch("first_name", "") ?? "";
  const last = watch("last_name", "") ?? "";
  const org = watch("org_name", "") ?? "";
  const status: BadgeStatus = issued ? "granted" : isSubmitting ? "verifying" : error ? "denied" : "idle";

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    try {
      const result = await registerMutation.mutateAsync(data);
      setIssued(true);
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
        result.tokens,
      );
      navigate("/onboarding");
    } catch (err: any) {
      const code = err.response?.status;
      const apiMsg = err.response?.data?.error?.message;
      setError(
        !err.response
          ? "Can't reach the server. Check that the API is running and try again."
          : code === 429
            ? "Too many sign-up attempts from this network. Wait a while and try again."
            : apiMsg || t("registerPage.error.registrationFailed"),
      );
    }
  };

  // The form is long: bring a failed-submit message into view next to the button.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const group = "text-2xl font-extrabold tracking-[-0.02em]";

  return (
    <AuthShell
      width={560}
      headline="Your company, set up today."
      badge={
        <LoginBadge
          name={titleCase(`${first} ${last}`.trim())}
          subline={org.trim() ? `Admin at ${org.trim()}` : ""}
          placeholderName="Your name"
          placeholderSubline="Admin at your company"
          passwordLength={password.length}
          status={status}
          labels={{ idle: "Ready to issue", verifying: "Creating workspace…", granted: "Badge issued", denied: "Could not create" }}
        />
      }
    >
      <h1 className="text-5xl font-extrabold leading-none tracking-[-0.03em]" style={DISPLAY}>
        Create your Nexora HR account
      </h1>
      <p className="mt-4 text-lg text-[#10231D]/70">{t("registerPage.header.subtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-9" noValidate>
        <section className="space-y-5">
          <h2 className={group} style={DISPLAY}>
            {t("registerPage.section.organization")}
          </h2>
          <TextField
            label={t("registerPage.field.companyName.label")}
            placeholder={t("registerPage.field.companyName.placeholder")}
            autoComplete="organization"
            error={errors.org_name?.message}
            {...register("org_name")}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label={t("registerPage.field.country.label")}
              placeholder="IN"
              error={errors.org_country?.message}
              {...register("org_country")}
            />
            <TextField
              label={t("registerPage.field.state.label")}
              placeholder="Karnataka"
              error={errors.org_state?.message}
              {...register("org_state")}
            />
          </div>
        </section>

        <section className="space-y-5">
          <h2 className={group} style={DISPLAY}>
            {t("registerPage.section.adminAccount")}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label={t("registerPage.field.firstName.label")}
              placeholder="Ananya"
              autoComplete="given-name"
              error={errors.first_name?.message}
              {...register("first_name")}
            />
            <TextField
              label={t("registerPage.field.lastName.label")}
              placeholder="Gupta"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>
          <TextField
            label={t("registerPage.field.email.label")}
            type="email"
            autoComplete="email"
            placeholder={t("registerPage.field.email.placeholder")}
            error={errors.email?.message}
            {...register("email")}
          />
          <div>
            <TextField
              label={t("registerPage.field.password.label")}
              type="password"
              autoComplete="new-password"
              placeholder={t("registerPage.field.password.placeholder")}
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrength password={password} />
          </div>
        </section>

        <div className="space-y-5">
        {error && (
          <div
            ref={errorRef}
            className="flex items-start gap-3 rounded-xl bg-[#F7D9D4] px-4 py-3.5 text-[15px] text-[#7A1F14]"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <SubmitButton busy={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t("registerPage.submit.creating")}</span>
            </>
          ) : (
            <>
              <span>{t("registerPage.submit.default")}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </SubmitButton>
        </div>
      </form>

      <p className="mt-9 text-base text-[#10231D]/70">
        {t("registerPage.footer.alreadyHaveAccount")}{" "}
        <Link
          to="/login"
          className="font-semibold text-[#10231D] underline decoration-[#F4B63F] decoration-[3px] underline-offset-4 hover:decoration-[#10231D]"
        >
          {t("registerPage.footer.signIn")}
        </Link>
      </p>
    </AuthShell>
  );
}

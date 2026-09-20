import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

interface Props {
  moduleName: string;
  targetUrl: string;
}

export default function ModuleLauncherPage({ moduleName, targetUrl }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      const ssoUrl = `${targetUrl}?sso_token=${encodeURIComponent(accessToken)}`;
      window.location.href = ssoUrl;
    }
  }, [accessToken, targetUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <h2 className="text-xl font-semibold text-gray-800">
        Authenticating & Launching {moduleName}...
      </h2>
      <p className="text-sm text-gray-500">
        Connecting seamlessly using Single Sign-On (SSO)
      </p>
    </div>
  );
}

import React from "react";
import { getProviders, signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import type { AuthMode } from "./types";

type SocialProviderId = "github" | "google";
type SocialProvider = { id: SocialProviderId; name: string };

const providerOptions: SocialProvider[] = [
  { id: "github", name: "GitHub" },
  { id: "google", name: "Google" }
];

const SocialSignInButtons = ({ mode }: { mode: AuthMode }) => {
  const [providers, setProviders] = React.useState<SocialProvider[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    let active = true;

    void getProviders()
      .then((configuredProviders) => {
        if (active) {
          setProviders(providerOptions.filter(({ id }) => configuredProviders?.[id]));
        }
      })
      .catch(() => {
        if (active) {
          setErrorMessage("Social sign-in options could not be loaded. Please try again.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSignIn = async (providerId: SocialProviderId) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await signIn(providerId, { callbackUrl: "/profiles" });
    } catch {
      setErrorMessage("Social sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!providers.length && !errorMessage) return null;

  return (
    <div className="mt-8">
      {providers.length > 0 && (
        <>
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-500" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-neutral-900 px-3 text-sm text-zinc-300">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {providers.map((provider) => {
              const action = mode === "signin" ? "Sign in" : "Sign up";

              return (
                <button
                  key={provider.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void handleSignIn(provider.id)}
                  title={`${action} with ${provider.name}`}
                  aria-label={`${action} with ${provider.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-500 bg-white text-neutral-900 transition hover:scale-105 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {provider.id === "github" ? (
                    <FaGithub aria-hidden={true} size={20} />
                  ) : (
                    <FcGoogle aria-hidden={true} size={22} />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-zinc-400">
            {isLoading ? "Connecting..." : "Continue with Google or GitHub"}
          </p>
        </>
      )}

      {errorMessage && (
        <p className="mt-4 text-center text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SocialSignInButtons;

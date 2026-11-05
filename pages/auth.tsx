import Image from "next/image";
import { useRouter } from "next/router";
import AuthForm from "../components/auth/AuthForm";
import SocialSignInButtons from "../components/auth/SocialSignInButtons";
import type { AuthMode } from "../components/auth/types";

export default function AuthPage() {
  const router = useRouter();
  const mode: AuthMode = router.query.mode === "register" ? "register" : "signin";
  const socialError =
    router.isReady && typeof router.query.error === "string"
      ? "Social sign-in failed. Please try again or use your email and password."
      : "";

  const toggleMode = () => {
    void router.push(mode === "signin" ? "/auth?mode=register" : "/auth");
  };

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50">
        <nav className="h-20 w-full bg-black lg:bg-opacity-50">
          <Image
            src="/images/logo.png"
            alt="Netflix"
            width={1280}
            height={346}
            className="h-12 w-auto"
            priority
          />
        </nav>

        <div className="flex justify-center">
          <section className="mt-2 w-full self-center rounded-md bg-black/70 px-8 py-12 sm:px-16 sm:py-16 lg:w-2/5 lg:max-w-md">
            <AuthForm
              mode={mode}
              initialError={socialError}
              onToggleMode={toggleMode}
            />
            <SocialSignInButtons mode={mode} />
          </section>
        </div>
      </div>
    </main>
  );
}

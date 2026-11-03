import axios from "axios";
import Input from "../components/input";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [variant, setVariant] = React.useState<"signin" | "register">("signin");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (variant === "register") {
        await axios.post("/api/register", { email, username, password });
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/"
      });

      if (result?.error) {
        if (variant === "register") {
          setVariant("signin");
          setErrorMessage("Your account was created. Please sign in.");
        } else {
          setErrorMessage("Invalid email or password.");
        }
        return;
      }

      if (result?.url) {
        await router.push(result.url);
      } else {
        setErrorMessage("Unable to sign in. Please try again.");
      }
    } catch (error) {
      const fallbackMessage =
        variant === "register"
          ? "Unable to create your account."
          : "Unable to sign in. Please try again.";
      setErrorMessage(
        axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? fallbackMessage
          : fallbackMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50">
   
        <nav className="bg-black w-full h-20 lg:bg-opacity-50">
          <img src="/images/logo.png" alt="Logo" className="h-12"  />
        </nav>
        
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-2xl mb-8 font-semibold">
              {variant === "signin" ? "Sign In" : "Register"}
            </h2>
            
            <form onSubmit={handleSubmit} aria-busy={isLoading}>
              <div className="flex flex-col gap-4">
                {variant === "register" && (
                  <Input 
                    label="Username"
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value)}
                    id="username"
                    type="text"
                    value={username}
                  />
                )}
                <Input 
                  label="Email"
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)}
                  id="email"
                  type="email"
                  value={email}
                />
                <Input 
                  label="Password"
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)}
                  id="password"
                  type="password"
                  value={password}
                />
              </div>

              {errorMessage && (
                <p className="mt-4 text-sm text-red-400" role="alert">
                  {errorMessage}
                </p>
              )}
            
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoading
                  ? "Please wait..."
                  : variant === "signin"
                    ? "Sign In"
                    : "Sign Up"}
              </button>
            </form>
            
            <p className="text-white mt-4">
              {variant === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setVariant(variant === "signin" ? "register" : "signin");
                }}
                className="text-red-600 ml-1 hover:underline"
              >
                {variant === "signin" ? "Create an account" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

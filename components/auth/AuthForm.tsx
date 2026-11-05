import axios from "axios";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Input from "../input";
import type { AuthMode } from "./types";

interface AuthFormProps {
  mode: AuthMode;
  initialError: string;
  onToggleMode: () => void;
}

const AuthForm = ({ mode, initialError, onToggleMode }: AuthFormProps) => {
  const router = useRouter();
  const [form, setForm] = React.useState({ email: "", username: "", password: "" });
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const displayedErrorMessage = errorMessage || initialError;

  const updateField = (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleMode = () => {
    setErrorMessage("");
    onToggleMode();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (mode === "register") await axios.post("/api/register", form);
      const result = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
        callbackUrl: "/profiles"
      });

      if (result?.error) {
        if (mode === "register") await router.replace("/auth");
        setErrorMessage(
          mode === "register"
            ? "Your account was created. Please sign in."
            : "Invalid email or password."
        );
        return;
      }

      if (result?.url) await router.push(result.url);
      else setErrorMessage("Unable to sign in. Please try again.");
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        if (error.response?.status === 409) {
          await router.replace("/auth");
          setErrorMessage("An account with this email already exists. Please sign in.");
          return;
        }

        setErrorMessage(error.response?.data?.error ?? "Unable to create your account.");
        return;
      }

      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold text-white">
        {mode === "signin" ? "Sign In" : "Register"}
      </h1>

      <form onSubmit={handleSubmit} aria-busy={isLoading}>
        <div className="flex flex-col gap-4">
          {mode === "register" && (
            <Input
              label="Username"
              onChange={updateField("username")}
              id="username"
              type="text"
              value={form.username}
            />
          )}
          <Input
            label="Email"
            onChange={updateField("email")}
            id="email"
            type="email"
            value={form.email}
          />
          <Input
            label="Password"
            onChange={updateField("password")}
            id="password"
            type="password"
            value={form.password}
          />
        </div>

        {displayedErrorMessage && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {displayedErrorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-10 w-full rounded-md bg-red-600 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-white">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={toggleMode}
          className="ml-1 text-red-600 hover:underline"
        >
          {mode === "signin" ? "Create an account" : "Login"}
        </button>
      </p>
    </>
  );
};

export default AuthForm;

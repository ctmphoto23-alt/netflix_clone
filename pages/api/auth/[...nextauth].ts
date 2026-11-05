import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prismadb";

const compare = bcrypt.compare;

// Keep email/password authentication aligned with the registration hash format.
const providers: AuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.trim().toLowerCase() }
      });

      if (!user || !(await compare(credentials.password, user.hashedPassword))) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      };
    }
  })
];

const githubClientId =
  process.env.GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? process.env.github_id;
const githubClientSecret =
  process.env.GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? process.env.github_secret;

// OAuth providers are enabled only when both credentials are present.
if (githubClientId && githubClientSecret) {
  providers.push(GitHubProvider({ clientId: githubClientId, clientSecret: githubClientSecret }));
}

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env["google-client-id"];
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env["google-client-secret"];

if (googleClientId && googleClientSecret) {
  providers.push(GoogleProvider({ clientId: googleClientId, clientSecret: googleClientSecret }));
}

export const authOptions: AuthOptions = {
  providers,
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  // JWT sessions allow OAuth and credentials sign-in without a database adapter.
  session: {
    strategy: "jwt"
  }
};

export default NextAuth(authOptions);
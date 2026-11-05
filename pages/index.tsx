import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import Navbar from "../components/navbar";
import Billboard from "@/components/Billboard";

export const getServerSideProps: GetServerSideProps<{
  profileImage: string | null;
  profileName: string;
  email: string;
}> = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    };
  }

  return {
    props: {
      profileImage: session.user?.image ?? null,
      profileName: session.user?.name ?? "Profile",
      email: session.user?.email ?? ""
    }
  };
};

export default function Home({
  profileImage,
  profileName,
  email
}: {
  profileImage: string | null;
  profileName: string;
  email: string;
}) {
  return (
    <main className="min-h-screen bg-black">
      <Navbar profileImage={profileImage} profileName={profileName} email={email} />
      <Billboard />
      <div className="fixed inset-x-0 bottom-0 p-6">
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/auth" })}
          className="h-10 w-full bg-white"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}

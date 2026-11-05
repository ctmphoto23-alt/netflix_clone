import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export const getServerSideProps: GetServerSideProps<{ profileName: string }> = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    };
  }

  return { props: { profileName: session.user?.name || "Profile" } };
};

const Profiles = ({ profileName }: { profileName: string }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-900 px-4 text-center text-white">
      <h1 className="text-3xl font-bold">Who is watching?</h1>
      <div className="mt-10 flex items-center justify-center gap-8">
        <Link
          href="/"
          aria-label={`Continue as ${profileName}`}
          className="group mx-auto flex w-44 flex-col"
        >
          <div className="flex h-44 w-44 items-center overflow-hidden rounded-md border-2 border-transparent group-hover:border-white">
            <Image
              src="/images/default-blue.png"
              alt={profileName}
              width={176}
              height={176}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 text-center text-2xl text-gray-400 group-hover:text-white">
            {profileName}
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Profiles;

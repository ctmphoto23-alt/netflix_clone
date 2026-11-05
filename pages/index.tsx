import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Navbar from "../components/navbar";
import Billboard from "@/components/Billboard";
import Movielist from "@/components/movielist";
import { movieListSelect, type MovieListItem } from "@/lib/movies";
import prismadb from "@/lib/prismadb";

export const getServerSideProps: GetServerSideProps<{
  profileImage: string | null;
  profileName: string;
  email: string;
  movies: MovieListItem[];
  favoriteIds: string[];
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

  const [movies, user] = await Promise.all([
    prismadb.movie.findMany({ select: movieListSelect }),
    session.user?.email
      ? prismadb.user.findUnique({
        where: { email: session.user.email.trim().toLowerCase() },
        select: { favoriteIds: true }
      })
      : null
  ]);

  return {
    props: {
      profileImage: session.user?.image ?? null,
      profileName: session.user?.name ?? "Profile",
      email: session.user?.email ?? "",
      movies,
      favoriteIds: user?.favoriteIds ?? []
    }
  };
};

export default function Home({
  profileImage,
  profileName,
  email,
  movies,
  favoriteIds
}: {
  profileImage: string | null;
  profileName: string;
  email: string;
  movies: MovieListItem[];
  favoriteIds: string[];
}) {
  return (
    <main className="min-h-screen bg-black">
      <Navbar profileImage={profileImage} profileName={profileName} email={email} />
      <Billboard />
      <Movielist movies={movies} initialFavoriteIds={favoriteIds} />
    </main>
  );
}

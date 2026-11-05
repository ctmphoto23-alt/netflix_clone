import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Navbar from "@/components/navbar";
import Movielist from "@/components/movielist";
import { movieListSelect, type MovieListItem } from "@/lib/movies";
import prismadb from "@/lib/prismadb";

type MyListProps = {
  profileImage: string | null;
  profileName: string;
  email: string;
  movies: MovieListItem[];
  favoriteIds: string[];
};

export const getServerSideProps: GetServerSideProps<MyListProps> = async ({
  req,
  res
}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false
      }
    };
  }

  const email = session.user?.email?.trim().toLowerCase();
  const user = email
    ? await prismadb.user.findUnique({
        where: { email },
        select: { favoriteIds: true }
      })
    : null;
  const favoriteIds = user?.favoriteIds ?? [];
  const movies = favoriteIds.length
    ? await prismadb.movie.findMany({
        where: { id: { in: favoriteIds } },
        select: movieListSelect
      })
    : [];

  return {
    props: {
      profileImage: session.user?.image ?? null,
      profileName: session.user?.name ?? "Profile",
      email: session.user?.email ?? "",
      movies,
      favoriteIds
    }
  };
};

export default function MyListPage({
  profileImage,
  profileName,
  email,
  movies,
  favoriteIds
}: MyListProps) {
  return (
    <main className="min-h-screen bg-black pt-20">
      <Navbar
        profileImage={profileImage}
        profileName={profileName}
        email={email}
      />
      <Movielist
        movies={movies}
        initialFavoriteIds={favoriteIds}
        view="favorites"
      />
    </main>
  );
}

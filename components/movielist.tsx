import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { BsChevronDown, BsPlayFill } from "react-icons/bs";
import FavoriteButton from "@/components/favoritebutton";
import InfoModal from "@/components/infomodal";
import type { ReactNode } from "react";
import type { MovieDetails, MovieListItem } from "@/lib/movies";

export type { MovieListItem } from "@/lib/movies";

type FavoriteResponse = {
  favoriteIds: string[];
};

type MovieCardsProps = {
  movies: MovieListItem[];
  favoriteIds: string[];
  pendingMovieId: string | null;
  onToggleFavorite: (movieId: string) => void;
  onShowInfo: (movie: MovieDetails) => void;
};

const MovieCards = ({
  movies,
  favoriteIds,
  pendingMovieId,
  onToggleFavorite,
  onShowInfo
}: MovieCardsProps) => (
  <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
    {movies.map((movie) => (
      <li
        key={movie.id}
        className="w-2/3 shrink-0 snap-start sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        <article className="group relative overflow-hidden rounded-sm bg-zinc-900">
          <Link
            href={`/play-video/${movie.id}`}
            aria-label={`Play ${movie.title}`}
            className="relative block aspect-video overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Image
              src={movie.thumbnailUrl}
              alt={`${movie.title} thumbnail`}
              fill
              unoptimized
              sizes="(max-width: 640px) 67vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <BsPlayFill size={18} />
            </span>
            <div className="absolute inset-0 flex translate-y-2 flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent p-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <h3 className="mb-1 truncate font-semibold text-white">
                {movie.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-300">
                {movie.releaseYear ?? "Release year unavailable"}
                {" · "}
                {movie.director ?? "Director unavailable"}
              </p>
              <p className="mt-1 text-xs text-zinc-300">
                {movie.duration ?? "Duration unavailable"}
              </p>
            </div>
          </Link>
          <button
            type="button"
            aria-label={`More information about ${movie.title}`}
            onClick={() => onShowInfo(movie)}
            className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black opacity-0 transition-opacity duration-200 hover:bg-zinc-200 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <BsChevronDown aria-hidden="true" size={18} />
          </button>
          <FavoriteButton
            movieTitle={movie.title}
            isFavorite={favoriteIds.includes(movie.id)}
            disabled={pendingMovieId !== null}
            onClick={() => onToggleFavorite(movie.id)}
          />
        </article>
      </li>
    ))}
  </ul>
);

type MovieSectionProps = {
  title: string;
  movies: MovieListItem[];
  favoriteIds: string[];
  pendingMovieId: string | null;
  onToggleFavorite: (movieId: string) => void;
  onShowInfo: (movie: MovieDetails) => void;
  emptyMessage: string;
  action?: ReactNode;
};

const MovieSection = ({
  title,
  movies,
  favoriteIds,
  pendingMovieId,
  onToggleFavorite,
  onShowInfo,
  emptyMessage,
  action
}: MovieSectionProps) => (
  <section
    aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}
    className="space-y-4 px-4 py-8 md:px-12"
  >
    <div className="flex items-center justify-between gap-4">
      <h2
        id={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}
        className="text-xl font-semibold text-white md:text-2xl"
      >
        {title}
      </h2>
      {action}
    </div>
    {movies.length ? (
      <MovieCards
        movies={movies}
        favoriteIds={favoriteIds}
        pendingMovieId={pendingMovieId}
        onToggleFavorite={onToggleFavorite}
        onShowInfo={onShowInfo}
      />
    ) : (
      <p className="text-sm text-zinc-400">{emptyMessage}</p>
    )}
  </section>
);

const Movielist = ({
  movies,
  initialFavoriteIds,
  view = "home"
}: {
  movies: MovieListItem[];
  initialFavoriteIds: string[];
  view?: "home" | "favorites";
}) => {
  const [favoriteIds, setFavoriteIds] = useState(initialFavoriteIds);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [pendingMovieId, setPendingMovieId] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const favoriteMovies = movies.filter((movie) =>
    favoriteIds.includes(movie.id)
  );
  const closeMovieInfo = useCallback(() => setSelectedMovie(null), []);
  const updateFavorite = async (movieId: string) => {
    setPendingMovieId(movieId);
    setFavoriteError(null);

    try {
      const response = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId })
      });

      const result = (await response.json()) as
        | FavoriteResponse
        | { error: string };
      if (!response.ok) {
        throw new Error(
          "error" in result
            ? result.error
            : "Could not update favorites. Please try again."
        );
      };

      if (!("favoriteIds" in result)) {
        throw new Error("Could not update favorites. Please try again.");
      }

      setFavoriteIds(result.favoriteIds);
    } catch (error) {
      console.error("Failed to update movie favorite:", error);
      setFavoriteError(
        error instanceof Error
          ? error.message
          : "Could not update favorites. Please try again."
      );
    } finally {
      setPendingMovieId(null);
    }
  }

  return (
    <>
      {favoriteError && (
        <p className="px-4 text-sm text-red-400 md:px-12" role="alert">
          {favoriteError}
        </p>
      )}
      {view === "home" && (
        <MovieSection
          title="Trending Now"
          movies={movies}
          favoriteIds={favoriteIds}
          pendingMovieId={pendingMovieId}
          onToggleFavorite={(movieId) => void updateFavorite(movieId)}
          onShowInfo={setSelectedMovie}
          emptyMessage="No movies are available yet."
        />
      )}
      <MovieSection
        title="My List"
        movies={favoriteMovies}
        favoriteIds={favoriteIds}
        pendingMovieId={pendingMovieId}
        onToggleFavorite={(movieId) => void updateFavorite(movieId)}
        onShowInfo={setSelectedMovie}
        emptyMessage="Movies you add to favorites will appear here."
        action={
          view === "home" ? (
            <Link
              href="/my-list"
              className="text-sm text-zinc-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              See all
            </Link>
          ) : undefined
        }
      />
      <InfoModal movie={selectedMovie} onClose={closeMovieInfo} />
    </>
  );
};

export default Movielist;

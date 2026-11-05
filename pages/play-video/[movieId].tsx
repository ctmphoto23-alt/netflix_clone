import type { GetServerSideProps } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { authOptions } from "../api/auth/[...nextauth]";
import prismadb from "@/lib/prismadb";
import { getSafariCompatibleVideoUrl } from "@/lib/movies";

type PlayableMovie = {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
};

type PlayVideoProps = {
  movie: PlayableMovie;
};

export const getServerSideProps: GetServerSideProps<PlayVideoProps> = async ({
  req,
  res,
  params
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

  const movieId = params?.movieId;
  if (typeof movieId !== "string" || !/^[a-f\d]{24}$/i.test(movieId)) {
    return { notFound: true };
  }

  const movie = await prismadb.movie.findUnique({
    where: { id: movieId },
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
      videoUrl: true
    }
  });

  if (!movie) {
    return { notFound: true };
  }

  return {
    props: {
      movie: {
        ...movie,
        videoUrl: getSafariCompatibleVideoUrl(movie.videoUrl)
      }
    }
  };
}

export default function PlayVideo({ movie }: PlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const handlePlaybackError = useCallback((error: unknown) => {
    if (error instanceof Error && error.name === "NotAllowedError") {
      setNeedsUserGesture(true);
      return;
    }

    setNeedsUserGesture(false);
    setPlaybackError(
      error instanceof Error && error.name === "NotSupportedError"
        ? "Safari cannot play this video format. Try another title or use an H.264 MP4 source."
        : "Playback could not start. Try the video controls."
    );
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const startPlayback = async () => {
      try {
        await video.play();
      } catch (error) {
        if (isMounted) handlePlaybackError(error);
      }
    };
    void startPlayback();

    return () => {
      isMounted = false;
    };
  }, [handlePlaybackError, movie.videoUrl]);

  const playWithUserGesture = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    try {
      await video.play();
      setNeedsUserGesture(false);
      setPlaybackError(null);
    } catch (error) {
      handlePlaybackError(error);
    }
  };

  return (
    <main className="fixed inset-0 h-dvh w-screen overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        aria-label={movie.title}
        autoPlay
        controls
        muted
        playsInline
        preload="auto"
        onPlaying={() => {
          setNeedsUserGesture(false);
          setPlaybackError(null);
        }}
        onError={(event) => {
          const mediaError = event.currentTarget.error;
          setPlaybackError(
            mediaError?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
              ? "Safari cannot play this video format. Try another title or use an H.264 MP4 source."
              : "This video source could not be played. Check the source URL or try another movie."
          );
        }}
        poster={movie.thumbnailUrl}
        src={movie.videoUrl}
        className="h-full w-full object-contain"
      >
        Your browser does not support HTML video.
      </video>
      {(needsUserGesture || playbackError) && (
        <div
          role={playbackError ? "alert" : "status"}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 px-6 text-center"
        >
          <p>{playbackError ?? "Safari needs a tap before it can play this video."}</p>
          <button
            type="button"
            onClick={playWithUserGesture}
            className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-5 py-3 font-semibold text-black transition-colors hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <BsPlayFill aria-hidden="true" size={22} />
            Play with sound
          </button>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4 md:p-8">
        <Link
          href="/"
          className="pointer-events-auto inline-flex rounded-sm text-sm text-zinc-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          &larr; Back to browse
        </Link>
        <h1 className="text-right text-lg font-bold md:text-2xl">{movie.title}</h1>
      </div>
    </main>
  );
}

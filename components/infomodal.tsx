import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { BsPlayFill } from "react-icons/bs";
import type { MovieDetails } from "@/lib/movies";

type InfoModalProps = {
  movie: MovieDetails | null;
  onClose: () => void;
};

const InfoModal = ({ movie, onClose }: InfoModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const portalElement = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!movie || !portalElement) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movie, onClose, portalElement]);

  if (!movie || !portalElement) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-info-title"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-md bg-zinc-900 text-white shadow-2xl"
      >
        <div className="relative aspect-video">
          <Image
            src={movie.thumbnailUrl}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/20 to-transparent" />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close movie details"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <AiOutlineClose aria-hidden="true" size={22} />
          </button>
          <h2
            id="movie-info-title"
            className="absolute bottom-4 left-5 text-2xl font-bold md:bottom-6 md:left-7 md:text-4xl"
          >
            {movie.title}
          </h2>
        </div>
        <div className="space-y-4 p-5 md:p-7">
          <p className="text-sm leading-relaxed text-zinc-200 md:text-base">
            {movie.description}
          </p>
          <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-300">
            {movie.releaseYear && (
              <div>
                <dt className="sr-only">Release year</dt>
                <dd>{movie.releaseYear}</dd>
              </div>
            )}
            {movie.director && (
              <div>
                <dt className="sr-only">Director</dt>
                <dd>Directed by {movie.director}</dd>
              </div>
            )}
            {movie.duration && (
              <div>
                <dt className="sr-only">Duration</dt>
                <dd>{movie.duration}</dd>
              </div>
            )}
          </dl>
          <Link
            href={`/play-video/${movie.id}`}
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-5 py-3 font-semibold text-black transition-colors hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <BsPlayFill aria-hidden="true" size={22} />
            Play
          </Link>
        </div>
      </section>
    </div>,
    portalElement
  );
};

export default InfoModal;

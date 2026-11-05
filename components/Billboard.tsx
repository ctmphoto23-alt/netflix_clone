import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BsFillInfoCircleFill, BsPlayFill } from "react-icons/bs";
import InfoModal from "@/components/infomodal";
import useBillboard from "@/hooks/useBillboard";

const isMovieId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const Billboard = () => {
  const { data, error, isLoading } = useBillboard();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const closeInfoModal = useCallback(() => setIsInfoModalOpen(false), []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(desktopQuery.matches);

    updateViewport();
    desktopQuery.addEventListener("change", updateViewport);

    return () => desktopQuery.removeEventListener("change", updateViewport);
  }, []);

  return (
    <section
      aria-label="Featured title"
      className="group relative flex min-h-[70vh] items-end overflow-hidden bg-cover bg-center px-6 py-12 text-white md:px-16"
      style={{
        backgroundImage: data?.thumbnailUrl ? `url("${data.thumbnailUrl}")` : "none",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      {isDesktop && data?.videoUrl && (
        <video
          aria-hidden="true"
          autoPlay
          muted
          playsInline
          loop
          poster={data.thumbnailUrl}
          src={data.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {data?.thumbnailUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      )}
      <div className="relative max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          {data?.title ?? "Featured titles"}
        </h1>
        <p className="text-base md:text-lg">
          {data?.description ??
            (isLoading
              ? "Loading featured title..."
              : error
                ? "Could not load the featured title."
                : "No featured title is available yet.")}
        </p>
        {data && isMovieId(data.id) && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/play-video/${data.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-5 py-3 font-semibold text-black transition-colors hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <BsPlayFill aria-hidden="true" size={22} />
              Play
            </Link>
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-white/25 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <BsFillInfoCircleFill aria-hidden="true" size={20} />
              More Info
            </button>
          </div>
        )}
      </div>
      <InfoModal
        movie={isInfoModalOpen ? data ?? null : null}
        onClose={closeInfoModal}
      />
    </section>
  );
};

export default Billboard;
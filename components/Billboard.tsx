import useBillboard from "@/hooks/useBillboard";

type BillboardMovie = {
  title: string;
  description: string;
  thumbnailUrl: string;
};

const Billboard = () => {
  const { data, error, isLoading } = useBillboard<BillboardMovie>();

  return (
    <section
      aria-label="Featured title"
      className="relative flex min-h-[70vh] items-end overflow-hidden bg-cover bg-center px-6 py-12 text-white md:px-16"
      style={{
        backgroundImage: data?.thumbnailUrl ? `url("${data.thumbnailUrl}")` : "none",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
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
      </div>
    </section>
  );
};

export default Billboard;
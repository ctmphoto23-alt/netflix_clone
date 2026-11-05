import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import type { MovieDetails } from "@/lib/movies";

export type BillboardMovie = MovieDetails & {
  videoUrl: string;
};

const useBillboard = () => {
  const { data, error, isLoading } = useSWR<BillboardMovie | null>("/api/random", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return { data, error, isLoading };
};

export default useBillboard;
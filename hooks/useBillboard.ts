import useSWR from "swr";
import fetcher from "@/lib/fetcher";

type BillboardMovie = {
  title: string;
  description: string;
  thumbnailUrl: string;
};

const useBillboard = <T = BillboardMovie>() => {
  const { data, error, isLoading } = useSWR<T | null>("/api/random", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
  };
};

export default useBillboard;
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  favoriteIds: string[];
};

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR<CurrentUser>(
    "/api/current",
    fetcher
  );

  return { data, isLoading, isError: Boolean(error), mutate };
};

export default useCurrentUser;

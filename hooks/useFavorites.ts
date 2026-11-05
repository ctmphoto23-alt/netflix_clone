import useCurrentUser from "./useCurrentUser";

const useFavorites = () => {
  const { data, isLoading, isError, mutate } = useCurrentUser();
  return {
    favoriteIds: data?.favoriteIds,
    isError,
    isLoading,
    mutate
  };
};

export default useFavorites;
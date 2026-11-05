import { BsHeart, BsHeartFill } from "react-icons/bs";

type FavoriteButtonProps = {
  movieTitle: string;
  isFavorite: boolean;
  disabled: boolean;
  onClick: () => void;
};

const FavoriteButton = ({
  movieTitle,
  isFavorite,
  disabled,
  onClick
}: FavoriteButtonProps) => (
  <button
    type="button"
    aria-label={
      isFavorite
        ? `Remove ${movieTitle} from favorites`
        : `Add ${movieTitle} to favorites`
    }
    aria-pressed={isFavorite}
    disabled={disabled}
    onClick={onClick}
    className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60"
  >
    {isFavorite ? (
      <BsHeartFill className="text-red-500" size={17} />
    ) : (
      <BsHeart size={17} />
    )}
  </button>
);

export default FavoriteButton;

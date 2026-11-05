import type { Prisma } from "@prisma/client";

export const movieListSelect = {
  id: true,
  title: true,
  description: true,
  releaseYear: true,
  director: true,
  duration: true,
  thumbnailUrl: true
} satisfies Prisma.MovieSelect;

export const getSafariCompatibleVideoUrl = (videoUrl: string) =>
  videoUrl
    .replace(
      /\/ElephantsDream\/ed_1024_512kb\.mp4(?=$|[?#])/,
      "/ElephantsDream/ed_1024.mp4"
    )
    .replace(
      /\/sintel-open-movie-by-blender\/Sintel(?:%20| )-%20Open%20Movie%20by%20Blender\.mp4(?=$|[?#])/i,
      "/sintel-open-movie-by-blender/Sintel%20-%20Open%20Movie%20by%20Blender~1.ia.mp4"
    );

export type MovieListItem = Prisma.MovieGetPayload<{
  select: typeof movieListSelect;
}>;

export type MovieDetails = Pick<
  MovieListItem,
  | "id"
  | "title"
  | "description"
  | "thumbnailUrl"
  | "releaseYear"
  | "director"
  | "duration"
>;

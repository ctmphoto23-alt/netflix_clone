import type { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../lib/serverauth";
import prismadb from "../../lib/prismadb";

type FavoriteResponse = {
  favoriteIds: string[];
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FavoriteResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.headers["content-type"]?.startsWith("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }

  const { movieId } = req.body ?? {};
  if (
    typeof movieId !== "string" ||
    !/^[a-f\d]{24}$/i.test(movieId)
  ) {
    return res.status(400).json({ error: "A valid movie ID is required." });
  }

  try {
    const { user } = await serverAuth(req, res);
    const movie = await prismadb.movie.findUnique({
      where: { id: movieId },
      select: { id: true }
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    const favoriteIds = user.favoriteIds.includes(movieId)
      ? user.favoriteIds.filter((id) => id !== movieId)
      : [...user.favoriteIds, movieId];

    const updatedUser = await prismadb.user.update({
      where: { id: user.id },
      data: { favoriteIds },
      select: { favoriteIds: true }
    });

    return res.status(200).json({ favoriteIds: updatedUser.favoriteIds });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.error("Failed to update movie favorite:", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Could not update favorites.";
    return res.status(500).json({ error: message });
  }
}
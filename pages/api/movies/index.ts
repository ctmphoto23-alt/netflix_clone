import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { movieListSelect, type MovieListItem } from "@/lib/movies";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieListItem[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const movies = await prismadb.movie.findMany({ select: movieListSelect });

    return res.status(200).json(movies);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return res.status(500).json({ error: "Could not fetch movies." });
  }
}

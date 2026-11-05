import type { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverauth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await serverAuth(req, res);
    const movieCount = await prismadb.movie.count();

    if (movieCount === 0) {
      return res.status(200).json(null);
    }

    const randomIndex = Math.floor(Math.random() * movieCount);
    const randomMovie = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
      select: {
        title: true,
        description: true,
        thumbnailUrl: true
      }
    });

    return res.status(200).json(randomMovie[0] ?? null);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.error("Failed to load a random movie:", error);
    return res.status(500).json({ error: "Could not load the featured title." });
  }
}
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../lib/serverauth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user } = await serverAuth(req, res);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.error("Failed to load the current user:", error);
    return res.status(500).json({ error: "Could not load the current user." });
  }
}
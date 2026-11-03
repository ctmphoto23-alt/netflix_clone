import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const { email, username, password } = req.body ?? {};
  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !username.trim() ||
    !password
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.trim(),
        name: username.trim(),
        hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    console.error("User registration failed", error);
    return res.status(500).json({ error: "Unable to create your account" });
  }
}
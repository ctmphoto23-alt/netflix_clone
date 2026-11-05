import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  // Validate user input before hashing the password or contacting the database.
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
    // Store only a password hash and return a safe public user shape.
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
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

    if (
      error instanceof Prisma.PrismaClientInitializationError &&
      ["P1000", "P1001", "P1002", "P1017"].includes(error.errorCode ?? "")
    ) {
      return res.status(503).json({
        error: "Cannot connect to the database. Check the database credentials and network access."
      });
    }

    return res.status(500).json({
      error: "Account could not be saved. Check the server logs for details."
    });
  }
}
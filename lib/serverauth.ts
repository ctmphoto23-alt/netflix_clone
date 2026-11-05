import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import prisma from "./prismadb";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: session?.user?.name?.trim() || email,
      image: session?.user?.image ?? null,
      hashedPassword: null
    },
    update: {},
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      favoriteIds: true
    }
  });

  return { user };
};

export default serverAuth;
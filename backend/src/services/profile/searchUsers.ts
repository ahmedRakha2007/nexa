import { prisma } from "../../config/prisma.ts";

export async function searchUsersService(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          display_name: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      display_name: true,
      profile_picture_url: true,
    },
    take: 20,
  });
}
import { prisma } from "../../config/prisma.ts";

const getSentFriendRequestsService = async (userId: string) => {

  const requests =  await prisma.friendship.findMany({
    where: {
      sender_id: userId,
      status: "PENDING",
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      created_at: true,
      receiver: {
        select: {
          id: true,
          username: true,
          display_name: true,
        profile_picture_url: true,
        },
      },
    },
  });

  return requests
};

export default getSentFriendRequestsService;
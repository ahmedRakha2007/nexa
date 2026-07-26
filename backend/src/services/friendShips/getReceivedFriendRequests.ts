import { prisma } from "../../config/prisma.ts";

const getReceivedFriendRequestsService = async (userId: string) => {

  const requests =  await prisma.friendship.findMany({
    where: {
      receiver_id: userId,
      status: "PENDING",
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      created_at: true,
      sender: {
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

export default getReceivedFriendRequestsService;
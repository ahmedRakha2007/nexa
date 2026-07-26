import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

const acceptFriendRequestService = async (
  id: string,
  userId: string
) => {
  const friendship = await prisma.friendship.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      receiver_id: true,
      status: true,
    },
  });

  if (!friendship) {
    throw createError(404, "Friend request not found.");
  }

  if (friendship.status !== "PENDING") {
    throw createError(400, "This friend request is no longer pending.");
  }

  if (friendship.receiver_id !== userId) {
    throw createError(
      403,
      "You are not allowed to accept this friend request."
    );
  }

  await prisma.friendship.update({
    where: {
      id,
    },
    data: {
      status: "ACCEPTED",
    },
  });
};

export default acceptFriendRequestService;
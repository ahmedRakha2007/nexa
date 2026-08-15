import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";
export const getProfileFriendShipStatusService = async (
  currentUserId: string,
  username: string
) => {
  // find the profile user
  const profileUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!profileUser) {
    throw createError(404, "USER_NOT_FOUND");
  }

  // find friendship in either direction
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          sender_id: currentUserId,
          receiver_id: profileUser.id,
        },
        {
          sender_id: profileUser.id,
          receiver_id: currentUserId,
        },
      ],
    },
  });

  if (!friendship) {
    return {
      status: "NONE",
    };
  }

  if (friendship.status === "ACCEPTED") {
    return {
      status: "ACCEPTED",
    };
  }

  if (friendship.status === "PENDING") {
    return {
      status: "PENDING",
      direction:
        friendship.sender_id === currentUserId
          ? "SENT"
          : "RECEIVED",
    };
  }

  return {
    status: "NONE",
  };
};
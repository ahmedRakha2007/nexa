import { prisma } from "../../config/prisma.ts";

const getFriendsService = async (userId: string, search?: string) => {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          sender_id: userId,
          receiver: {
            OR: [
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                display_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
        {
          receiver_id: userId,
          sender: {
            OR: [
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                display_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    },

    orderBy: {
      created_at: "desc",
    },

    select: {
      id: true,
      created_at: true,
      sender_id: true,
      receiver_id: true,

      sender: {
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_picture_url: true,
        },
      },

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

  return friendships.map((friendship) => {
    const friend =
      friendship.sender_id === userId
        ? friendship.receiver
        : friendship.sender;

    return {
      friendship_id: friendship.id,
      created_at: friendship.created_at,
      friend,
    };
  });
};

export default getFriendsService;
import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

const createConversationService = async (
  userId: string,
  other_user_id: string
) => {
  // 1. Make sure other_user_id was provided
  if (!other_user_id) {
    throw createError(400, "Other user must exist");
  }

  // 2. Don't allow chatting with yourself
  if (userId === other_user_id) {
    throw createError(400, "You can't open a chat with yourself");
  }

  // 3. Check if the other user actually exists
  const otherUser = await prisma.user.findUnique({
    where: {
      id: other_user_id,
    },
  });

  if (!otherUser) {
    throw createError(404, "User not found");
  }

  // check if they are friends
  const friendship = await prisma.friendship.findFirst({
  where: {
    status: "ACCEPTED",
    OR: [
      {
        sender_id: userId,
        receiver_id: other_user_id,
      },
      {
        sender_id: other_user_id,
        receiver_id: userId,
      },
    ],
  },
});

if (!friendship) {
  throw createError(
    403,
    "You can only chat with your friends"
  );
}

  // 4. Check if the conversation already exists
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      members: {
        some: {
          user_id: userId,
        },
      },
      AND: {
        members: {
          some: {
            user_id: other_user_id,
          },
        },
      },
    },
    include: {
      members: true,
    },
  });

  // 5. If it exists, return it
  if (existingConversation) {
    return existingConversation;
  }

  // 6. Otherwise create the conversation
  const conversation = await prisma.conversation.create({
    data: {
      members: {
        create: [
          {
            user_id: userId,
          },
          {
            user_id: other_user_id,
          },
        ],
      },
    },
    include: {
      members: true,
    },
  });

  return conversation;
};

export default createConversationService;
import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

const getConversationMessagesService = async (
  userId: string,
  conversationId: string
) => {
  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });

  if (!membership) {
    throw createError(403, "You are not a member of this conversation");
  }


  const messages = await prisma.message.findMany({
    where: {
      conversation_id: conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_picture_url: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  return messages;
};

export default getConversationMessagesService;
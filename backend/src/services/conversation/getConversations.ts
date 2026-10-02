import { prisma } from "../../config/prisma.ts";

const getConversationsService = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      messages: {
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    },
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  return conversations;
};

export default getConversationsService;
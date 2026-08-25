import { prisma } from "../../config/prisma.ts";

const getNotificationsService = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      recipient_id: userId,
    },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_picture_url: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: 20,
  });

  return notifications;
};

export default getNotificationsService;
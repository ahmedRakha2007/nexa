import { prisma } from "../../config/prisma.ts";

const markAllNotificationsAsReadService = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: {
      recipient_id: userId,
      is_read: false,
    },
    data: {
      is_read: true,
    },
  });

  return result;
};

export default markAllNotificationsAsReadService;
import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

const markNotificationAsReadService = async (
  notificationId : any,
  userId: string
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      recipient_id: userId,
      is_read: false
    },
  });

  if (!notification) {
    throw createError(404, "Notification not found.");
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      is_read: true,
    },
  });

  return updatedNotification;
};

export default markNotificationAsReadService;
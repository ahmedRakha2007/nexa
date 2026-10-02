import { prisma } from "../../config/prisma.ts";
import type { NotificationType } from "../../generated/prisma/client.ts";
import { sendNotification } from "../../socket/notification.socket.ts";

interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
  conversationId?: string;
}

export async function createNotification({
  recipientId,
  actorId,
  type,
  postId,
  conversationId
}: CreateNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      recipient_id: recipientId,
      actor_id: actorId,
      type,
      post_id: postId,
      conversation_id: conversationId
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
  });

  sendNotification(recipientId, notification);

  return notification;
}
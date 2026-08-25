import { prisma } from "../../config/prisma.ts";
import type { NotificationType } from "../../generated/prisma/client.ts";

interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
}

export async function createNotification({
  recipientId,
  actorId,
  type,
  postId,
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      recipient_id: recipientId,
      actor_id: actorId,
      type,
      post_id: postId,
    },
  });
}
import { prisma } from "../config/prisma.ts";
import { createNotification } from "../services/notification/createNotification.ts";

export const registerChatHandlers = (io: any, socket: any) => {
  console.log("A user connected:", socket.id);
  console.log("userId:", socket.data.userId);

  socket.on("join_conversation", async (conversationId: string) => {
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: socket.data.userId,
        },
      },
    });

    if (!membership) {
      return socket.emit(
        "conversation_error",
        "You are not a member of this conversation"
      );
    }

    socket.join(`conversation:${conversationId}`);

    console.log(
      `User ${socket.data.userId} joined conversation ${conversationId}`
    );
  });

  socket.on("send_message", async (data: any) => {
    try {
      const { conversationId, content } = data;

      // 1. Validate message
      if (!content || typeof content !== "string" || !content.trim()) {
        return socket.emit(
          "message_error",
          "Message content is required"
        );
      }

      // 2. Check that the sender belongs to the conversation
      const membership = await prisma.conversationMember.findUnique({
        where: {
          conversation_id_user_id: {
            conversation_id: conversationId,
            user_id: socket.data.userId,
          },
        },
      });

      if (!membership) {
        return socket.emit(
          "conversation_error",
          "You are not a member of this conversation"
        );
      }

      // 3. Find the other member
      const otherMember = await prisma.conversationMember.findFirst({
        where: {
          conversation_id: conversationId,
          user_id: {
            not: socket.data.userId,
          },
        },
      });

      if (!otherMember) {
        return socket.emit(
          "conversation_error",
          "Conversation member not found"
        );
      }

      // 4. Save the message
      const message = await prisma.message.create({
        data: {
          conversation_id: conversationId,
          sender_id: socket.data.userId,
          content: content.trim(),
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
      });

      // 5. Send the message to everyone in the conversation
      io.to(`conversation:${conversationId}`).emit(
        "new_message",
        message
      );

      // 6. Check if the recipient is currently in this conversation
      const conversationRoom = io.sockets.adapter.rooms.get(
        `conversation:${conversationId}`
      );

      const recipientSockets = io.sockets.adapter.rooms.get(
        `user:${otherMember.user_id}`
      );

      const recipientIsInConversation =
        conversationRoom &&
        recipientSockets &&
        [...recipientSockets].some((socketId) =>
          conversationRoom.has(socketId)
        );

      // 7. Only create notification if recipient isn't in the chat
      if (!recipientIsInConversation) {
        await createNotification({
          recipientId: otherMember.user_id,
          actorId: socket.data.userId,
          type: "MESSAGE_RECEIVED",
          conversationId: conversationId
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      socket.emit(
        "message_error",
        "Failed to send message"
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};
import { apiClient } from "./client";

export const getConversations = async () => {
  const response = await apiClient.get("/conversations");

  return response.data.conversations;
};

export const createConversation = async (otherUserId: string) => {
  const response = await apiClient.post("/conversations", {
    other_user_id: otherUserId,
  });

  return response.data.conversation;
};

export const getOldMessages = async (conversationId: string) => {
  const response = await apiClient.get(`conversations/${conversationId}/messages`);

  return response.data.messages;
};

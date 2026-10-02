import { createConversation, getConversations, getOldMessages } from "@/lib/api/conversation.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: createConversation,
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};

export const useOldMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversationMessages", conversationId],
    queryFn: () => getOldMessages(conversationId),
  });
};

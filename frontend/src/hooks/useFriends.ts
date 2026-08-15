import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchFriends,
  fetchReceivedRequests,
  fetchSentRequests,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/api/users.api";

export function useFriends(query: string) {
  return useQuery({
    queryKey: ["friends", query],
    queryFn: () => fetchFriends(query),
  });
}

export function useSentRequests() {
  return useQuery({
    queryKey: ["sent-requests"],
    queryFn: fetchSentRequests,
  });
}

export function useReceivedRequests() {
  return useQuery({
    queryKey: ["received-requests"],
    queryFn: fetchReceivedRequests,
  });
}

export function useFriendMutations() {
  const queryClient = useQueryClient();

  const addFriend = useMutation({
    mutationFn: ({ receiverId }: { receiverId: string; username: string }) =>
      sendFriendRequest(receiverId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sent-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friendship-status", variables.username],
      });
    },
  });

  const accept = useMutation({
    mutationFn: ({ requestId }: { requestId: string; username: string }) =>
      acceptFriendRequest(requestId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["received-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friendship-status", variables.username],
      });
    },
  });

  const reject = useMutation({
    mutationFn: ({ requestId }: { requestId: string; username: string }) =>
      rejectFriendRequest(requestId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["received-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friendship-status", variables.username],
      });
    },
  });

  const cancel = useMutation({
    mutationFn: ({ requestId }: { requestId: string; username: string }) =>
      cancelFriendRequest(requestId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sent-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friendship-status", variables.username],
      });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: ({ friendshipId }: { friendshipId: string; username: string }) =>
      removeFriend(friendshipId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });

      queryClient.invalidateQueries({
        queryKey: ["friendship-status", variables.username],
      });
    },
  });

  return {
    accept,
    reject,
    cancel,
    deleteFriend,
    addFriend,
  };
}

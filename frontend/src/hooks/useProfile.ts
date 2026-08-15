import { fetchProfileFriendShipStatus, fetchUserProfile } from "@/lib/api/profile.api";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/profile.api";

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["users", "profile", username],
    queryFn: () => fetchUserProfile(username),
    enabled: Boolean(username),
  });
}

export function useProfileFriendShipStatus(username: string) {
  return useQuery({
    queryKey: ["friendship-status", username],
    queryFn: () => fetchProfileFriendShipStatus(username),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}

import { apiClient } from "./client";
import type { User } from "@/types";

export interface UserProfileResponse {
  success: boolean;
  profile: UserProfileData;
}
export interface UserProfileData {
  id: string;
  display_name: string;
  username: string;
  profile_picture_url: string;
  bio: string;
  posts_count: number;
  friends_count: number;
}

export interface FriendShipStatus {
  friendship_id: string;
  status: string;
  direction?: string;
}

export async function updateProfile(formData: FormData): Promise<User> {
  const response = await apiClient.patch("/profile/me", formData);

  return response.data.user;
}

export async function fetchUserProfile(username: string): Promise<UserProfileData> {
  const { data } = await apiClient.get<UserProfileResponse>(`/profile/${username}`);

  return data.profile;
}

export async function fetchProfileFriendShipStatus(username: string): Promise<FriendShipStatus> {
  const { data } = await apiClient.get(`/profile/${username}/friendship-status`);

  return data.friend_ship_status;
}

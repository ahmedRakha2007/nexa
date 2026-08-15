import type { UpdateProfileInput, User } from "@/types";
import { usersSeed } from "@/lib/placeholder-data";
import { apiClient } from "./client";

interface friendship {
  friendship_id: string;
  created_at: string;
  friend: {
    id: string;
    username: string;
    display_name: string;
    profile_picture_url: string;
  };
}

interface sentRequest {
  id: string;
  created_at: string;
  receiver: {
    id: string;
    username: string;
    display_name: string;
    profile_picture_url: string;
  };
}

interface receiveRequest {
  id: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    display_name: string;
    profile_picture_url: string;
  };
}

export async function sendFriendRequest(userId: string): Promise<string> {
  const { data } = await apiClient.post("/friend-requests", {
    receiver_id: userId,
  });

  return data.message;
}

export async function fetchFriends(query = ""): Promise<friendship[] | undefined> {
  const response = await apiClient.get("/friend-requests/friends", {
    params: {
      search: query,
    },
  });

  return response.data.friends;
}

export async function fetchSentRequests(): Promise<sentRequest[]> {
  const response = await apiClient.get("/friend-requests/sent");

  return response.data.requests;
}

export async function fetchReceivedRequests(): Promise<receiveRequest[]> {
  const response = await apiClient.get("/friend-requests/received");

  return response.data.requests;
}

export async function cancelFriendRequest(id: string): Promise<string> {
  const response = await apiClient.patch(`/friend-requests/${id}/cancel`);

  return response.data.message;
}
export async function rejectFriendRequest(id: string): Promise<string> {
  const response = await apiClient.patch(`/friend-requests/${id}/reject`);

  return response.data.message;
}
export async function acceptFriendRequest(id: string): Promise<string> {
  const response = await apiClient.patch(`/friend-requests/${id}/accept`);

  return response.data.message;
}

export async function removeFriend(id: string): Promise<string> {
  const response = await apiClient.delete(`/friend-requests/${id}`);

  return response.data.message;
}

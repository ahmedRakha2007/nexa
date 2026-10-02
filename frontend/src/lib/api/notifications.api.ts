import { apiClient } from "./client";

export interface NotificationActor {
  id: string;
  username: string;
  display_name: string;
  profile_picture_url: string | null;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: "FRIEND_REQUEST" | "FRIEND_ACCEPTED" | "POST_LIKED" | "POST_COMMENTED" | "MESSAGE_RECEIVED";
  post_id: string | null;
  conversation_id: string | null;
  is_read: boolean;
  created_at: string;
  actor: NotificationActor;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await apiClient.get("/notifications");
  return data.notifications;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data } = await apiClient.patch(`/notifications/${notificationId}/read`);
  return data.message;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await apiClient.patch("/notifications/read-all");
  return data.message;
};

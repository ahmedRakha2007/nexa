import { createFileRoute, Link } from "@tanstack/react-router";

import { Heart, MessageCircle, UserPlus, UserCheck, UserMinus } from "lucide-react";

import { UserAvatar } from "@/components/common/UserAvatar";

import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useNotifications";

import { AppLayout } from "@/components/layout/AppLayout";
import { Loader } from "@/components/common/Loader";
import { Notification } from "@/lib/api/notifications.api";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <AppLayout>
      <NotificationsComponent />
    </AppLayout>
  );
}

function NotificationsComponent() {
  const { data: notifications = [], isLoading, isError } = useNotifications();

  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

        <Loader label="Notifications loading..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

        <div className="py-10 text-center text-destructive">Failed to load notifications.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {notifications.map((notification) => {
            const content = getNotificationContent(notification);

            return (
              <Link
                key={notification.id}
                to={content.to}
                params={content.params}
                onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors last:border-b-0 hover:bg-accent ${
                  !notification.is_read ? "bg-secondary/50" : ""
                }`}
              >
                <UserAvatar user={notification.actor} size="sm" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <content.icon className="size-4 shrink-0" />

                    <p className="text-sm">
                      <span className="font-semibold">{notification.actor.display_name}</span>{" "}
                      {content.message}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

function getNotificationContent(notification: Notification) {
  switch (notification.type) {
    case "POST_LIKED":
      return {
        icon: Heart,
        message: "liked your post.",
        to: "/post/$postId" as const,
        params: {
          postId: notification.post_id!,
        },
      };

    case "POST_COMMENTED":
      return {
        icon: MessageCircle,
        message: "commented on your post.",
        to: "/post/$postId" as const,
        params: {
          postId: notification.post_id!,
        },
      };

    case "FRIEND_REQUEST":
      return {
        icon: UserPlus,
        message: "sent you a friend request.",
        to: "/profile/$username" as const,
        params: {
          username: notification.actor.username,
        },
      };

    case "FRIEND_ACCEPTED":
      return {
        icon: UserCheck,
        message: "accepted your friend request.",
        to: "/profile/$username" as const,
        params: {
          username: notification.actor.username,
        },
      };
  }
}

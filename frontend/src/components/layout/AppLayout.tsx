import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, Users, User as UserIcon, Search, MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/lib/api/notifications.api";

const mobileItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/search", label: "Search", icon: Search },
  { to: "/conversations", label: "Chats", icon: MessageCircle },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      queryClient.setQueryData(
        ["notifications"],
        (oldNotifications: Notification[] | undefined) => {
          return [notification, ...(oldNotifications ?? [])];
        },
      );
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [queryClient]);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-28 pt-6 md:pb-10">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              key={`/profile/${user?.username}`}
              to={`/profile/${user?.username}`}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <UserIcon className="size-5" />
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <UserIcon className="size-5" />
              Profile
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

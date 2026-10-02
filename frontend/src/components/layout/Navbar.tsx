import { Link } from "@tanstack/react-router";

import { Home, Users, User as UserIcon, LogOut, Search, Bell, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/search", label: "Search", icon: Search },
  { to: "/conversations", label: "Chats", icon: MessageCircle },
] as const;

export function Navbar() {
  const { user, signOut } = useAuth();
  const { data: notifications = [] } = useNotifications();

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="min-w-0 text-xl font-bold tracking-tight">
          <span className="text-gradient-brand">Nexa</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <Link
              to="/profile/$username"
              params={{ username: user.username }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Link
                to="/notifications"
                className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="size-5" />

                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <UserAvatar user={user} size="sm" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sign out"
                    className="rounded-full"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-5 sm:w-full sm:p-6">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out of your account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary">Cancel</AlertDialogCancel>

                    <AlertDialogAction className="bg-destructive" onClick={signOut}>
                      Sign out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="rounded-full">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

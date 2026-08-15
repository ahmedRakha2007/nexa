import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface User {
  id: string;
  username: string;
  display_name: string;
  profile_picture_url: string;
}

interface UserCardProps {
  user: User;
  action?: ReactNode;
}

export function UserCard({ user, action }: UserCardProps) {
  return (
    <div className="surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-glow)]">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar user={user} />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.display_name}</p>

          <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      {action}
    </div>
  );
}

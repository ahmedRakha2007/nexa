import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { Link } from "@tanstack/react-router";

const sizes = {
  sm: "size-9",
  md: "size-11",
  lg: "size-24",
} as const;

interface UserAvatarProps {
  user: Pick<User, "display_name" | "profile_picture_url" | "username">;
  size?: keyof typeof sizes;
  className?: string;
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  // Safely derive initials from display_name or fallback to username.
  const display = typeof user.display_name === "string" ? user.display_name.trim() : "";

  const parts = display
    ? display.split(/\s+/).filter(Boolean)
    : typeof user.username === "string"
      ? [user.username]
      : [];

  const initials = parts
    .map((p) => (p && p[0] ? p[0] : ""))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link to={`/profile/${user.username}`}>
      <Avatar className={cn(sizes[size], "ring-1 ring-border", className)}>
        <AvatarImage
          src={user.profile_picture_url ?? undefined}
          alt={display || user.username || "User"}
        />

        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}

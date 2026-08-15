import { Link } from "@tanstack/react-router";
import { navItems } from "./Navbar";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:translate-x-0.5 hover:bg-accent hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}

        {user ? (
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:translate-x-0.5 hover:bg-accent hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
          >
            <UserIcon className="size-4 shrink-0" />
            <span className="truncate">Profile</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:translate-x-0.5 hover:bg-accent hover:text-foreground"
          >
            <UserIcon className="size-4 shrink-0" />
            <span className="truncate">Profile</span>
          </Link>
        )}
      </nav>
    </aside>
  );
}

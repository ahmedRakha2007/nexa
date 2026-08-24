import { UserAvatar } from "@/components/common/UserAvatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchUsers } from "@/hooks/useProfile";
import { User } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  return (
    <AppLayout>
      <SearchComponent />
    </AppLayout>
  );
}
function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const { data, isLoading } = useSearchUsers(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          placeholder="Search users..."
          className="h-10 w-full rounded-full border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-6">
        {isLoading && debouncedQuery.trim().length >= 2 ? (
          <p className="text-sm text-muted-foreground">Searching...</p>
        ) : data?.length === 0 && debouncedQuery.trim().length >= 2 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-2">
            {data?.map((user: User) => (
              <div key={user.id} className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted">
                <div className="size-10 overflow-hidden rounded-full bg-muted">
                  <UserAvatar user={user} />
                </div>

                <div>
                  <p className="font-medium">{user.display_name}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

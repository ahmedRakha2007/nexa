import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, UsersRound, UserPlus, Send } from "lucide-react";

import { RequireAuth } from "@/components/layout/RequireAuth";
import { UserCard } from "@/components/users/UserCard";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useFriendMutations,
  useFriends,
  useReceivedRequests,
  useSentRequests,
} from "@/hooks/useFriends";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Nexa" },
      {
        name: "description",
        content: "Browse and manage your friends and friend requests.",
      },
      { property: "og:title", content: "Friends — Nexa" },
      {
        property: "og:description",
        content: "Browse and manage your friends and friend requests.",
      },
    ],
  }),

  component: () => (
    <RequireAuth>
      <Friends />
    </RequireAuth>
  ),
});

function Friends() {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: friendsData, isLoading: isFriendsLoading } = useFriends(debouncedQuery);

  const { data: sentRequestsData, isLoading: isSentRequestsLoading } = useSentRequests();

  const { data: receivedRequestsData, isLoading: isReceivedRequestsLoading } =
    useReceivedRequests();
  const { accept, reject, cancel, deleteFriend } = useFriendMutations();

  // Debounce friend search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Tabs */}
      <div className="mb-10 flex justify-center">
        <div className="flex rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setActiveTab("friends")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "friends"
                ? "bg-background shadow-sm"
                : "cursor-pointer text-muted-foreground hover:text-foreground"
            }`}
          >
            Friends
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "requests"
                ? "bg-background shadow-sm"
                : "cursor-pointer text-muted-foreground hover:text-foreground"
            }`}
          >
            Requests
          </button>
        </div>
      </div>

      {/* Friends */}
      {activeTab === "friends" && (
        <section>
          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends"
              className="h-12 rounded-full pl-11"
            />
          </div>

          {isFriendsLoading ? (
            <Loader />
          ) : !friendsData?.length ? (
            <EmptyState
              icon={UsersRound}
              title={query ? "No friends found" : "You have no friends yet"}
              description={
                query
                  ? "Try searching with a different name or username."
                  : "Add some friends to see them here."
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {friendsData.map((friendship) => (
                <UserCard
                  key={friendship.friendship_id}
                  user={friendship.friend}
                  action={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="shrink-0 rounded-full"
                      onClick={() =>
                        deleteFriend.mutate({
                          friendshipId: friendship.friendship_id,
                          username: friendship.friend.username,
                        })
                      }
                    >
                      remove friend
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Requests */}
      {activeTab === "requests" && (
        <section className="space-y-10">
          {/* Received */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Received requests</h2>

              <p className="text-sm text-muted-foreground">People who want to be your friend.</p>
            </div>

            {isReceivedRequestsLoading ? (
              <Loader />
            ) : !receivedRequestsData?.length ? (
              <EmptyState
                icon={UserPlus}
                title="No friend requests"
                description="You don't have any pending friend requests right now."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {receivedRequestsData.map((request) => (
                  <UserCard
                    key={request.id}
                    user={request.sender}
                    action={
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            accept.mutate({
                              requestId: request.id,
                              username: request.sender.username,
                            })
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            reject.mutate({
                              requestId: request.id,
                              username: request.sender.username,
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sent */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Sent requests</h2>

              <p className="text-sm text-muted-foreground">
                Friend requests you've sent that are still pending.
              </p>
            </div>

            {isSentRequestsLoading ? (
              <Loader />
            ) : !sentRequestsData?.length ? (
              <EmptyState
                icon={Send}
                title="No sent requests"
                description="You don't have any pending friend requests you've sent."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {sentRequestsData.map((request) => (
                  <UserCard
                    key={request.id}
                    user={request.receiver}
                    action={
                      <div className="flex gap-2">
                        <Link to={`/profile/${request.receiver.username}`}>
                          <Button variant="secondary" size="sm" className="rounded-full">
                            View
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            cancel.mutate({
                              requestId: request.id,
                              username: request.receiver.username,
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

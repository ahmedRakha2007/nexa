import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, MessageSquareDashed } from "lucide-react";

import { PostCard } from "@/components/posts/PostCard";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFeed, useFriendsFeed, usePostMutations } from "@/hooks/usePosts";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexa — Your feed" },
      {
        name: "description",
        content: "Follow friends, share updates and browse your Nexa feed in one calm place.",
      },
      { property: "og:title", content: "Nexa — Your feed" },
      {
        property: "og:description",
        content: "Follow friends, share updates and browse your Nexa feed in one calm place.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <AppLayout>
      <Feed />
    </AppLayout>
  );
}

function Feed() {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");
  const [open, setOpen] = useState(false);

  const { data: feedData, isLoading: isFeedLoading } = useFeed(page);

  const { data: friendsFeedData, isLoading: isFriendsFeedLoading } = useFriendsFeed(page);

  const { create, edit, remove, like, unlike } = usePostMutations();

  // Decide which data to display
  const activeData = activeTab === "feed" ? feedData : friendsFeedData;

  const isLoading = activeTab === "feed" ? isFeedLoading : isFriendsFeedLoading;

  const posts = activeData?.posts ?? [];
  const totalPages = activeData?.total_pages ?? 1;
  const currentPage = activeData?.page ?? page;

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [1];
    }

    const pageWindow = window.innerWidth < 640 ? 3 : 5;
    const halfWindow = Math.floor(pageWindow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);

    const endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const handleTabChange = (tab: "feed" | "friends") => {
    setActiveTab(tab);

    // Start from page 1 when switching feeds
    setPage(1);
  };

  return (
    <>
      {/* Tabs */}
      <div className="mb-10 flex justify-center">
        <div className="flex rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => handleTabChange("feed")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "feed"
                ? "bg-background shadow-sm"
                : "cursor-pointer text-muted-foreground hover:text-foreground"
            }`}
          >
            Feed
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("friends")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              activeTab === "friends"
                ? "bg-background shadow-sm"
                : "cursor-pointer text-muted-foreground hover:text-foreground"
            }`}
          >
            Friends Feed
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Loader label="Loading posts" />
      ) : !posts.length ? (
        <EmptyState
          icon={MessageSquareDashed}
          title={activeTab === "friends" ? "No posts from your friends" : "No posts yet"}
          description={
            activeTab === "friends"
              ? "Your friends haven't shared any posts yet."
              : "Be the first to share something with your friends."
          }
          action={
            <Button className="rounded-full" onClick={() => setOpen(true)}>
              Create post
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Posts */}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={post.user}
              isOwner={post.user_id === user?.id}
              onEdit={async (id, content, image) => {
                await edit.mutateAsync({
                  id,
                  content,
                  image,
                });
              }}
              onDelete={(id) => remove.mutateAsync(id)}
              onLike={() => like.mutateAsync(post.id)}
              onUnLike={() => unlike.mutateAsync(post.id)}
            />
          ))}

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-w-16 shrink-0 sm:min-w-20"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              {visiblePageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  className="h-9 w-9 shrink-0 p-0"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="h-9 min-w-16 shrink-0 sm:min-w-20"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create post */}
      {user && (
        <>
          <Button
            onClick={() => setOpen(true)}
            aria-label="Create post"
            className="fixed bottom-24 right-5 z-40 size-14 rounded-full shadow-(--shadow-glow) transition-transform hover:scale-105 md:bottom-8 md:right-8"
          >
            <Plus className="size-6" />
          </Button>

          <CreatePostModal
            open={open}
            onOpenChange={setOpen}
            onSubmit={async (input) => {
              await create.mutateAsync(input);
            }}
          />
        </>
      )}
    </>
  );
}

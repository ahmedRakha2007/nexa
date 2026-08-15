import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, MessageSquareDashed } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PostCard } from "@/components/posts/PostCard";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFeed, usePostMutations } from "@/hooks/usePosts";
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
  const { data, isLoading } = useFeed(page);
  const { create, edit, remove } = usePostMutations(user);
  const [open, setOpen] = useState(false);

  const posts = data?.posts ?? [];
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;

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

  return (
    <>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight">Home</h1>

      {isLoading ? (
        <Loader label="Loading posts" />
      ) : !posts.length ? (
        <EmptyState
          icon={MessageSquareDashed}
          title="No posts yet"
          description="Be the first to share something with your friends."
          action={
            <Button className="rounded-full" onClick={() => setOpen(true)}>
              Create post
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={post.user}
              isOwner={post.user_id === user?.id}
              onEdit={async (id, content, image) => {
                await edit.mutateAsync({ id, content, image });
              }}
              onDelete={(id) => remove.mutateAsync(id)}
            />
          ))}

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

      {user ? (
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
      ) : (
        ""
      )}
    </>
  );
}

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { usePost, usePostMutations } from "../../hooks/usePosts";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import PostLikeButton from "@/components/posts/PostLikeButton";
import CommentItem from "@/components/posts/CommentItem";
import CommentForm from "@/components/posts/CommentForm";

export const Route = createFileRoute("/post/$postId")({
  component: PostPage,
});

function PostPage() {
  return (
    <AppLayout>
      <Post />
    </AppLayout>
  );
}

function Post() {
  const { postId } = Route.useParams();
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(postId);

  const { like, unlike, addComment, removeComment } = usePostMutations();

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="surface animate-pulse p-5">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
          <div className="mt-3 h-20 rounded bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="surface p-8 text-center">
          <h1 className="text-lg font-semibold">Post not found</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This post may have been deleted or doesn't exist.
          </p>

          <Button asChild className="mt-5 rounded-full">
            <Link to="/">Go back</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => router.history.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      {/* Post */}
      <article className="surface overflow-hidden">
        <div className="p-5">
          {/* Author */}
          <div className="flex items-center gap-3">
            <UserAvatar user={post.user} />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{post.user.display_name}</p>

              <p className="truncate text-xs text-muted-foreground">
                @{post.user.username} ·{" "}
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
          )}

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="mt-5 max-h-[600px] w-full rounded-xl object-cover"
            />
          )}

          {/* Stats */}
          <div className="mt-5 flex items-center gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
            <PostLikeButton
              post={post}
              onLike={() => like.mutateAsync(post.id)}
              onUnLike={() => unlike.mutateAsync(post.id)}
            />

            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border">
          <div className="px-5 py-4">
            <h2 className="font-semibold">
              Comments
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {post.comments_count}
              </span>
            </h2>
          </div>

          {/* Add comment */}
          <CommentForm
            onSubmit={(content) =>
              addComment.mutateAsync({
                postId: post.id,
                content,
              })
            }
            isSubmitting={addComment.isPending}
          />

          {/* Comments list */}
          {post.comments.length === 0 ? (
            <div className="px-5 pb-6 text-center text-sm text-muted-foreground">
              No comments yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {post.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={() =>
                    removeComment.mutateAsync({ commentId: comment.id, postId: comment.post_id })
                  }
                  isDeleting={removeComment.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

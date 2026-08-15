import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { Post, User } from "@/types";

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  onEdit: (id: string, content: string, image?: File | null) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  user: {
    display_name: string;
    username: string;
    profile_picture_url: string;
  };
}

export function PostCard({ post, user, isOwner, onEdit, onDelete }: PostCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content ?? "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image_url ?? null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setPreview(post.image_url ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage, post.image_url]);

  const resetEditingState = () => {
    setDraft(post.content ?? "");
    setSelectedImage(null);
    setPreview(post.image_url ?? null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setActionError(null);
  };

  return (
    <article className="surface p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-(--shadow-glow)">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.display_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              @{user.username} ·{" "}
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Post actions"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="cursor-pointer" onClick={() => setEditing(true)}>
                <span className="inline-flex size-4 items-center justify-center text-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path d="M4 20h4l10-10-4-4L4 16z" />
                    <path d="m14 6 4 4" />
                  </svg>
                </span>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <span className="inline-flex size-4 items-center justify-center text-destructive">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path d="M4 7h16" />
                    <path d="M9 7V5h6v2" />
                    <path d="M7 7l1 12h8l1-12" />
                  </svg>
                </span>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>

      {editing ? (
        <div className="mt-4 space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="rounded-xl"
          />

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground transition hover:bg-muted/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
              <path d="m8 14 2.5-3 2.5 3 1.5-2 2.5 3" />
              <circle cx="9" cy="9" r="1.2" />
            </svg>
            <span>{selectedImage ? "Change image" : "Add image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
            />
          </label>

          {preview ? (
            <div className="relative overflow-hidden rounded-xl">
              <img src={preview} alt="Selected preview" className="max-h-64 w-full object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={removeImage}
                aria-label="Remove image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </Button>
            </div>
          ) : null}

          {actionError ? <p className="text-xs text-destructive">{actionError}</p> : null}

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetEditingState();
                setEditing(false);
                setActionError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-full"
              onClick={async () => {
                setIsSubmitting(true);
                setActionError(null);

                try {
                  await onEdit(post.id, draft.trim(), selectedImage);
                  setEditing(false);
                  resetEditingState();
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Unable to update post";
                  setActionError(message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting || (!draft.trim() && !selectedImage)}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
      )}

      {!editing && post.image_url ? (
        <img
          src={post.image_url}
          alt=""
          loading="lazy"
          className="mt-4 aspect-16/10 w-full rounded-xl object-cover"
        />
      ) : null}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be removed from your feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                setIsSubmitting(true);
                setActionError(null);

                try {
                  await onDelete(post.id);
                  setIsDeleteDialogOpen(false);
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Unable to delete post";
                  setActionError(message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}

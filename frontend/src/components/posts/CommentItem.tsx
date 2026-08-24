import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Comment, DeleteCommentInput } from "@/types";

interface CommentItemProps {
  comment: Comment;
  onDelete: () => Promise<string> | void;
  isDeleting: boolean;
}

export default function CommentItem({ comment, onDelete, isDeleting }: CommentItemProps) {
  const { user } = useAuth();

  const isOwner = user?.id === comment.user.id;

  return (
    <div className="flex gap-3 px-5 py-4">
      <UserAvatar user={comment.user} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{comment.user.display_name}</p>

          <p className="text-xs text-muted-foreground">@{comment.user.username}</p>
        </div>

        <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </p>

          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              disabled={isDeleting}
              aria-label="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

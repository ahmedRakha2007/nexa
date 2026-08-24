import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Post } from "@/types";

interface PostLikeProps {
  post: Post;
  onLike: (id: string) => Promise<void> | void;
  onUnLike: (id: string) => Promise<void> | void;
}
const PostLikeButton = ({ post, onLike, onUnLike }: PostLikeProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 rounded-full"
      onClick={async () => {
        if (!user) {
          navigate({ to: "/login" });
          return;
        }

        if (post.is_liked) {
          await onUnLike(post.id);
        } else {
          await onLike(post.id);
        }
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={post.is_liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={`h-5 w-5 ${post.is_liked ? "text-red-500" : "text-muted-foreground"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>

      <span>{post.likes_count}</span>
    </Button>
  );
};

export default PostLikeButton;

import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<unknown>;
  isSubmitting: boolean;
}

export default function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="px-5 pb-5">
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">Sign in to leave a comment.</p>

          <Button asChild size="sm" className="mt-3 rounded-full">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    setError(null);

    try {
      await onSubmit(trimmedContent);
      setContent("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to add comment");
    }
  };

  return (
    <div className="px-5 pb-5">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="rounded-xl"
        disabled={isSubmitting}
      />

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      <div className="mt-2 flex justify-end">
        <Button
          size="sm"
          className="rounded-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Commenting..." : "Comment"}
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/common/Modal";

import type { CreatePostInput } from "@/types";

const schema = z.object({
  content: z.string().max(500, "500 characters max"),
  image: z.custom<FileList>().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreatePostInput) => Promise<void>;
}

export function CreatePostModal({ open, onOpenChange, onSubmit }: CreatePostModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });

  const selectedImage = form.watch("image");

  useEffect(() => {
    const file = selectedImage?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

  const submit = form.handleSubmit(async (values) => {
    const content = values.content.trim();
    const image = values.image?.[0];

    setSubmitError(null);

    if (!content && !image) {
      form.setError("content", {
        type: "manual",
        message: "Write something or choose an image",
      });
      return;
    }

    try {
      await onSubmit({
        content: content || undefined,
        image,
      });

      form.reset();
      setPreview(null);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create post";
      setSubmitError(message);
    }
  });

  const removeImage = () => {
    form.setValue("image", undefined);
    setPreview(null);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Post">
      <form onSubmit={submit} className="space-y-4">
        <Textarea
          rows={5}
          placeholder="What's happening?"
          className="rounded-xl"
          {...form.register("content")}
        />

        {form.formState.errors.content ? (
          <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
        ) : null}

        {submitError ? <p className="text-xs text-destructive">{submitError}</p> : null}

        {preview ? (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={preview}
              alt="Selected image preview"
              className="max-h-80 w-full object-cover"
            />

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 rounded-full"
              onClick={removeImage}
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground transition hover:bg-muted/50">
            <ImagePlus className="size-5" />
            <span>Choose an image</span>

            <input type="file" accept="image/*" className="hidden" {...form.register("image")} />
          </label>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              setPreview(null);
              setSubmitError(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

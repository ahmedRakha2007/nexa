import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useProfile";
import type { UserProfileData } from "@/lib/api/profile.api";

const schema = z.object({
  display_name: z.string().trim().min(2, "Display name must be at least 2 characters"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_.]+$/, "Lowercase letters, numbers, underscores and dots only"),

  bio: z.string().max(160, "Bio must be 160 characters or less"),
});

type FormValues = z.infer<typeof schema>;

type EditProfileFormProps = {
  profile: UserProfileData;
  onSuccess: () => void;
};

export function EditProfileForm({ profile, onSuccess }: EditProfileFormProps) {
  const { updateUser } = useAuth();

  const updateProfileMutation = useUpdateProfile();

  const [imagePreview, setImagePreview] = useState(profile.profile_picture_url ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      display_name: profile.display_name ?? "",
      username: profile.username ?? "",
      bio: profile.bio ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      display_name: profile.display_name ?? "",
      username: profile.username ?? "",
      bio: profile.bio ?? "",
    });

    setImagePreview(profile.profile_picture_url ?? "");
    setImageFile(null);
  }, [profile, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const submit = form.handleSubmit(async (values) => {
    const formData = new FormData();

    formData.append("display_name", values.display_name);
    formData.append("username", values.username);
    formData.append("bio", values.bio);

    if (imageFile) {
      formData.append("profile_image", imageFile);
    }

    const updatedUser = await updateProfileMutation.mutateAsync(formData);

    updateUser(updatedUser);

    onSuccess?.();
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Profile image */}
      <div className="flex flex-col items-center gap-3">
        <div className="size-24 overflow-hidden rounded-full bg-muted">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={profile.display_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
              {profile.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Change photo
        </Button>
      </div>

      {/* Display name */}
      <div className="space-y-2">
        <Label htmlFor="display_name">Display name</Label>

        <Input
          id="display_name"
          {...form.register("display_name")}
          placeholder="Your display name"
        />

        {form.formState.errors.display_name && (
          <p className="text-xs text-destructive">{form.formState.errors.display_name.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input id="username" {...form.register("username")} placeholder="Your username" />

        {form.formState.errors.username && (
          <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>

        <textarea
          id="bio"
          {...form.register("bio")}
          rows={4}
          placeholder="Tell people about yourself..."
          className="flex w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />

        {form.formState.errors.bio && (
          <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
        )}
      </div>

      {/* Error from API */}
      {updateProfileMutation.isError && (
        <p className="text-sm text-destructive">Failed to update your profile. Please try again.</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

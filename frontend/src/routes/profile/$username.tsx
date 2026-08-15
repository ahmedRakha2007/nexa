import { createFileRoute, Link } from "@tanstack/react-router";

import { usePostMutations, useUserPosts } from "@/hooks/usePosts";
import { useProfileFriendShipStatus, useUserProfile } from "@/hooks/useProfile";
import { Post } from "@/types";
import { PostCard } from "@/components/posts/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import ProfileHeader from "@/components/ui/profileHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { useFriendMutations } from "@/hooks/useFriends";

export const Route = createFileRoute("/profile/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppLayout>
      <Profile />
    </AppLayout>
  );
}

function Profile() {
  const { user } = useAuth();
  const { username } = Route.useParams();

  const { edit, remove } = usePostMutations(user);

  const [editOpen, setEditOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useUserProfile(username);

  const { data: postsData, isLoading: loadingPosts } = useUserPosts(username);

  const { data: friendshipStatusData, isLoading: loadingFriendshipStatus } =
    useProfileFriendShipStatus(username);

  const { accept, reject, cancel, deleteFriend, addFriend } = useFriendMutations();
  if (loadingProfile) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Profile not found</h1>

        <Link to="/" className="text-blue-500 hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === profile.id;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start justify-between gap-4">
        <ProfileHeader profile={profile} />

        {/* Profile actions */}
        <div className="flex gap-2">
          {isOwner ? (
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit Profile</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Edit Profile</DialogTitle>
                </DialogHeader>

                <EditProfileForm
                  profile={profile}
                  onSuccess={() => {
                    setEditOpen(false);
                    setShowToast(true);
                  }}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <>
              {!user ? (
                ""
              ) : (
                <>
                  {/* No friendship */}
                  {friendshipStatusData?.status === "NONE" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        addFriend.mutate({
                          receiverId: profile.id,
                          username: profile.username,
                        })
                      }
                    >
                      Add Friend
                    </Button>
                  )}

                  {/* Request sent by current user */}
                  {friendshipStatusData?.status === "PENDING" &&
                    friendshipStatusData.direction === "SENT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() =>
                          cancel.mutate({
                            requestId: friendshipStatusData.friendship_id,
                            username: profile.username,
                          })
                        }
                      >
                        Cancel
                      </Button>
                    )}

                  {/* Request received from profile user */}
                  {friendshipStatusData?.status === "PENDING" &&
                    friendshipStatusData.direction === "RECEIVED" && (
                      <>
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            accept.mutate({
                              requestId: friendshipStatusData.friendship_id,
                              username: profile.username,
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
                              requestId: friendshipStatusData.friendship_id,
                              username: profile.username,
                            })
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}

                  {/* Already friends */}
                  {friendshipStatusData?.status === "ACCEPTED" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="shrink-0 rounded-full"
                      onClick={() =>
                        deleteFriend.mutate({
                          friendshipId: friendshipStatusData.friendship_id,
                          username: profile.username,
                        })
                      }
                    >
                      remove friend
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {showToast && (
          <Toast
            title="Profile updated"
            description="Your changes have been saved."
            open={showToast}
            onOpenChange={setShowToast}
          />
        )}
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Posts</h2>

        {loadingPosts ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {postsData?.posts?.length ? (
              postsData.posts.map((post: Post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={profile}
                  isOwner={post.user_id === user?.id}
                  onEdit={async (id, content, image) => {
                    await edit.mutateAsync({
                      id,
                      content,
                      image,
                    });
                  }}
                  onDelete={(id) => remove.mutateAsync(id)}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No posts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPost,
  deletePost,
  fetchFeed,
  fetchFriendsFeed,
  fetchUserPosts,
  updatePost,
  UserPostsData,
} from "@/lib/api/posts.api";
import type { CreatePostInput, UpdatePostInput, User } from "@/types";

export const feedQueryKey = ["posts", "feed"] as const;

export function useFeed(page: number) {
  return useQuery({
    queryKey: ["posts", "feed", page],
    queryFn: () => fetchFeed(page),
  });
}

export function useFriendsFeed(page: number) {
  return useQuery({
    queryKey: ["posts", "feed", "friends", page],
    queryFn: () => fetchFriendsFeed(page),
  });
}

export function useUserPosts(username: string) {
  return useQuery<UserPostsData>({
    queryKey: ["posts", "user", username],
    queryFn: () => fetchUserPosts(username),
    enabled: Boolean(username),
  });
}

export function usePostMutations(author: User | null) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const create = useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess: invalidate,
    onError: (error: Error) => {
      toast.error(error.message || "Unable to create post");
    },
  });

  const edit = useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(input),
    onSuccess: invalidate,
    onError: (error: Error) => {
      toast.error(error.message || "Unable to update post");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: invalidate,
    onError: (error: Error) => {
      toast.error(error.message || "Unable to delete post");
    },
  });

  return { create, edit, remove };
}

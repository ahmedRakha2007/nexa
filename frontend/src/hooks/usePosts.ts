import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchFeed,
  fetchFriendsFeed,
  fetchUserPosts,
  getPost,
  likePost,
  unlikePost,
  updatePost,
  UserPostsData,
} from "@/lib/api/posts.api";
import type {
  CreateCommentInput,
  CreatePostInput,
  DeleteCommentInput,
  UpdatePostInput,
} from "@/types";

export const feedQueryKey = ["posts", "feed"] as const;

export function useFeed(page: number, enabled = true) {
  return useQuery({
    queryKey: ["posts", "feed", page],
    queryFn: () => fetchFeed(page),
    enabled,
  });
}

export function useFriendsFeed(page: number, enabled = true) {
  return useQuery({
    queryKey: ["posts", "feed", "friends", page],
    queryFn: () => fetchFriendsFeed(page),
    enabled,
  });
}

export function useUserPosts(username: string) {
  return useQuery<UserPostsData>({
    queryKey: ["posts", "user", username],
    queryFn: () => fetchUserPosts(username),
    enabled: Boolean(username),
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });
}

export function usePostMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const create = useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),

    onSuccess: () => {
      invalidate();
      toast.success("Your post was created successfully");
    },
  });

  const edit = useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(input),

    onSuccess: () => {
      invalidate();
      toast.success("Your post was updated successfully");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePost(id),

    onSuccess: () => {
      invalidate();
      toast.success("Your post was deleted successfully");
    },
  });

  const like = useMutation({
    mutationFn: (postId: string) => likePost(postId),

    onSuccess: (_, postId) => {
      invalidate();

      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
  });

  const unlike = useMutation({
    mutationFn: (postId: string) => unlikePost(postId),

    onSuccess: (_, postId) => {
      invalidate();

      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
    },
  });

  const addComment = useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(input),

    onSuccess: (_, variables) => {
      invalidate();

      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
    },
  });

  const removeComment = useMutation({
    mutationFn: (input: DeleteCommentInput) => deleteComment(input.commentId),

    onSuccess: (_, variables) => {
      invalidate();

      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });

      toast.success("Comment deleted");
    },
  });

  return {
    create,
    edit,
    remove,
    like,
    unlike,
    addComment,
    removeComment,
  };
}

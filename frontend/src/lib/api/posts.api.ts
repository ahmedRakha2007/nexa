import type { CreatePostInput, Post, UpdatePostInput, User } from "@/types";
import { apiClient } from "./client";
import axios from "axios";

export interface FeedResponse {
  success: boolean;
  posts: {
    posts: Post[];
    totalPosts: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface UserPostsData {
  posts: Post[];
  page: number;
  limit: number;
  total_pages: number;
}

export interface UserPostsResponse {
  success: boolean;
  posts: UserPostsData;
}
export async function fetchFeed(page: number = 1, limit: number = 15) {
  const response = await apiClient.get<FeedResponse>("/feed", {
    params: {
      page,
      limit,
    },
  });
  return response.data.posts;
}

export async function fetchUserPosts(username: string): Promise<UserPostsData> {
  const { data } = await apiClient.get<UserPostsResponse>(`/profile/${username}/posts`);

  return data.posts;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export async function createPost(input: CreatePostInput): Promise<Post | undefined> {
  const formData = new FormData();

  if (input.content) {
    formData.append("content", input.content);
  }

  if (input.image instanceof File) {
    formData.append("image", input.image);
  }

  try {
    const post = await apiClient.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return post.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to create post"));
  }
}

export async function updatePost(input: UpdatePostInput): Promise<Post> {
  const formData = new FormData();

  if (input.content) {
    formData.append("content", input.content);
  }

  if (input.image instanceof File) {
    formData.append("image", input.image);
  }

  try {
    const post = await apiClient.patch(`/posts/${input.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return post.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to update post"));
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await apiClient.delete(`/posts/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to delete post"));
  }
}

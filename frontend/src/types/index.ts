export interface User {
  id: string;
  display_name: string;
  username: string;
  email: string;
  provider: "LOCAL" | "GOOGLE";
  birth_date: string;
  profile_picture_url: string | null;
  bio: string | null;
  friends_count: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user: { display_name: string; username: string; profile_picture_url: string };
  content?: string;
  image_url?: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: number;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: { id: string; username: string; display_name: string; profile_picture_url: string };
}

export interface CreatePostInput {
  content?: string;
  image?: File | null;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
}
export interface DeleteCommentInput {
  commentId: string;
  postId: string;
}

export interface UpdatePostInput {
  id: string;
  content?: string;
  image?: File | null;
}

export interface UpdateProfileInput {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}

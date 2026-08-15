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
}

export interface CreatePostInput {
  content?: string;
  image?: File | null;
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

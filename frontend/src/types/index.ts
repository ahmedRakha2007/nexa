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

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    username: string;
    display_name: string | null;
    profile_picture_url: string | null;
  };
}

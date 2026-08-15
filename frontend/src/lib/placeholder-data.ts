import type { Post, User } from "@/types";

/**
 * Local placeholder data. Replace every consumer with real Axios calls
 * once the backend exists — see src/lib/api/*.api.ts.
 */
export const currentUserSeed: User = {
  id: "u1",
  display_name: "Ava Reyes",
  username: "avareyes",
  email: "ava@nexa.app",
  bio: "Product designer. Building calm interfaces and drinking too much espresso.",
  profile_picture_url: "https://i.pravatar.cc/240?img=47",
  friend_count: 248,
  provider: "LOCAL",
  birth_date: "1990-01-01",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const usersSeed: User[] = [
  currentUserSeed,
  {
    id: "u2",
    display_name: "Milo Hartman",
    username: "milohart",
    email: "milo@nexa.app",
    bio: "Frontend engineer",
    profile_picture_url: "https://i.pravatar.cc/240?img=12",
    friend_count: 132,
    provider: "LOCAL",
    birth_date: "1991-02-02",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "u3",
    display_name: "Sofia Lindqvist",
    username: "sofial",
    bio: "Photographer",
    profile_picture_url: "https://i.pravatar.cc/240?img=32",
    friend_count: 981,
  },
  {
    id: "u4",
    display_name: "Dev Kapoor",
    username: "devkap",
    bio: "Runs on coffee and CI pipelines",
    profile_picture_url: "https://i.pravatar.cc/240?img=15",
    friend_count: 74,
  },
  {
    id: "u5",
    display_name: "Nina Okafor",
    username: "ninao",
    bio: "Writer, occasionally funny",
    profile_picture_url: "https://i.pravatar.cc/240?img=45",
    friend_count: 410,
  },
];

export const postsSeed: Post[] = [
  {
    id: "p1",
    author: currentUserSeed,
    content: "Shipped a new spacing scale today. Everything suddenly breathes. Small changes, big difference.",
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "p2",
    author: usersSeed[2],
    content: "Blue hour over the harbour. No edits, just the light doing its thing.",
    image_url:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "p3",
    author: usersSeed[1],
    content: "Reminder: a component you can read in ten seconds is worth more than a clever one.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "p4",
    author: usersSeed[4],
    content: "Wrote 900 words, deleted 800. Net progress: excellent.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
];

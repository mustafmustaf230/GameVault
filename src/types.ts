export type Platform =
  | "playstation" | "xbox" | "nintendo" | "pc" | "handheld"
  | "mobile" | "component" | "vr" | "retro" | "esports" | "general";

export type Category = "news" | "review" | "rumor" | "guide" | "opinion";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  summary: string;
  cover_image_url: string | null;
  platform: Platform;
  category: Category;
  tags: string[] | null;
  author_id: string | null;
  is_featured: boolean;
  views: number;
  created_at: string;
  author?: Profile;
}

export interface Comment {
  id: string;
  article_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  author?: Profile;
}

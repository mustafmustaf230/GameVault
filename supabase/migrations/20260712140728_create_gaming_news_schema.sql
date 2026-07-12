/*
# Gaming Community News - Schema Setup

## Overview
Creates the database schema for a gaming community news platform called "PIXELVAULT".
Supports all platforms (consoles, PC, handhelds) and components.
Users can sign up, browse news, comment, and publish their own articles.
Premium subscription ($2/month) unlocks commenting and publishing.

## Tables

### profiles
- id (uuid, PK, references auth.users)
- username (text, unique) - display name
- avatar_url (text) - profile picture URL
- is_premium (boolean, default false) - whether user has active premium subscription
- premium_expires_at (timestamptz, nullable) - when premium expires
- bio (text, nullable) - user bio
- created_at (timestamptz)

### articles
- id (uuid, PK)
- title (text, not null)
- body (text, not null) - article content in markdown/plain text
- summary (text) - short excerpt
- cover_image_url (text, not null) - cover art image URL
- platform (text, not null) - one of: playstation, xbox, nintendo, pc, handheld, component, vr, mobile, retro, esports, general
- category (text, not null) - one of: news, review, rumor, guide, opinion
- tags (text[]) - optional tags
- author_id (uuid, references profiles, defaults to auth.uid())
- is_featured (boolean, default false)
- views (integer, default 0)
- created_at (timestamptz)

### comments
- id (uuid, PK)
- article_id (uuid, references articles, cascade delete)
- author_id (uuid, references profiles, defaults to auth.uid())
- body (text, not null)
- created_at (timestamptz)

## Security (RLS)
- profiles: users can read all profiles, update only their own
- articles: anyone (anon + authenticated) can read; any authenticated user can insert (publishing is also gated by premium in app logic); authors can update/delete their own
- comments: anyone can read; only authenticated users can insert (app gates behind premium); authors can delete their own
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text DEFAULT NULL,
  is_premium boolean NOT NULL DEFAULT false,
  premium_expires_at timestamptz DEFAULT NULL,
  bio text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
ON profiles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  summary text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('playstation','xbox','nintendo','pc','handheld','component','vr','mobile','retro','esports','general')),
  category text NOT NULL CHECK (category IN ('news','review','rumor','guide','opinion')),
  tags text[] DEFAULT '{}',
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE SET NULL,
  is_featured boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "articles_select_all" ON articles;
CREATE POLICY "articles_select_all"
ON articles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "articles_insert_auth" ON articles;
CREATE POLICY "articles_insert_auth"
ON articles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "articles_update_own" ON articles;
CREATE POLICY "articles_update_own"
ON articles FOR UPDATE
TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "articles_delete_own" ON articles;
CREATE POLICY "articles_delete_own"
ON articles FOR DELETE
TO authenticated USING (auth.uid() = author_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all" ON comments;
CREATE POLICY "comments_select_all"
ON comments FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_auth" ON comments;
CREATE POLICY "comments_insert_auth"
ON comments FOR INSERT
TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own"
ON comments FOR DELETE
TO authenticated USING (auth.uid() = author_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_platform ON articles (platform);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (is_featured);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments (article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at DESC);
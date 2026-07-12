/*
# Restrict article publishing to admin users only

## Changes
1. Add `is_admin` boolean column to `profiles` (default false)
2. Drop the old article INSERT policy that allowed any authenticated user
3. Create a new article INSERT policy that only allows users where `profiles.is_admin = true`
4. Same for article UPDATE and DELETE — only admins can modify articles

## Rationale
The app owner wants to be the only person who can publish news.
A new `is_admin` flag on profiles controls who can INSERT/UPDATE/DELETE articles.
The owner will set their own profile's `is_admin = true` after signing up.
Premium still unlocks commenting for regular users.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Drop old article policies
DROP POLICY IF EXISTS "articles_insert_auth" ON articles;
DROP POLICY IF EXISTS "articles_update_own" ON articles;
DROP POLICY IF EXISTS "articles_delete_own" ON articles;

-- New INSERT policy: only admins can publish
CREATE POLICY "articles_insert_admin"
ON articles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- New UPDATE policy: only admins can edit
CREATE POLICY "articles_update_admin"
ON articles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- New DELETE policy: only admins can delete
CREATE POLICY "articles_delete_admin"
ON articles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Allow users to read their own is_admin flag (already covered by profiles_select_all)
-- No additional policy needed since profiles_select_all already grants SELECT to all.
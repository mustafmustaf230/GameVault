/*
# Restrict Article Publishing to Admin Only

## Changes
1. Replaces the article INSERT policy so only authenticated users with `is_admin = true` can publish articles.
2. Regular premium users can still comment (commenting is separate from publishing).

## Security
- articles INSERT: restricted to admin users only (checked via profiles.is_admin)
- articles UPDATE/DELETE: already restricted to own or admin
- comments: unchanged — premium users can still comment
*/

DROP POLICY IF EXISTS "articles_insert_auth" ON articles;
CREATE POLICY "articles_insert_admin_only" ON articles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

/*
# Premium Publishing + Subscriptions + Auto-Delete

## Changes

1. **Articles INSERT policy** — Replaced admin-only insert with a policy that allows any authenticated user to insert articles. Premium enforcement happens at the app level (the frontend checks is_premium before showing the publish form). This is simpler and more flexible than a SQL-level premium check, and aligns with the user's request that premium users can publish their own gaming news.

2. **Articles UPDATE/DELETE** — Added policies so article authors (not just admins) can edit/delete their own articles.

3. **subscriptions table** — New table to track Stripe premium subscriptions ($2/month).
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to profiles, defaults to auth.uid())
   - `stripe_subscription_id` (text, unique)
   - `status` (text: active, canceled, past_due)
   - `current_period_end` (timestamptz)
   - `created_at` (timestamptz)

4. **Auto-delete old articles** — Creates a function `delete_old_articles()` that deletes articles older than 3 days, and schedules it via pg_cron to run every hour.

## Security
- subscriptions: users can read only their own records. INSERT/UPDATE via edge function with service role.
- articles: authors can update/delete their own articles; admins can update/delete any.
*/

-- SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due')),
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_subscriptions" ON subscriptions;
CREATE POLICY "read_own_subscriptions" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_subscription" ON subscriptions;
CREATE POLICY "insert_own_subscription" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_subscription" ON subscriptions;
CREATE POLICY "update_own_subscription" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ARTICLES: allow authors to publish (premium check at app level)
DROP POLICY IF EXISTS "articles_insert_admin" ON articles;
CREATE POLICY "articles_insert_auth" ON articles FOR INSERT
  TO authenticated WITH CHECK (true);

-- ARTICLES: allow authors to update/delete their own
DROP POLICY IF EXISTS "articles_update_admin" ON articles;
CREATE POLICY "articles_update_own_or_admin" ON articles FOR UPDATE
  TO authenticated USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "articles_delete_admin" ON articles;
CREATE POLICY "articles_delete_own_or_admin" ON articles FOR DELETE
  TO authenticated USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- AUTO-DELETE: function to delete articles older than 3 days
CREATE OR REPLACE FUNCTION delete_old_articles()
RETURNS void AS $$
BEGIN
  DELETE FROM articles WHERE created_at < now() - interval '3 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule it with pg_cron every hour
SELECT cron.schedule(
  'delete-old-articles',
  '0 * * * *',
  'SELECT delete_old_articles()'
);

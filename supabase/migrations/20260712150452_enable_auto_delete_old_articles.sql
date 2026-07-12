/*
# Auto-delete articles older than 3 days

1. Overview
   This migration sets up an automatic hourly cleanup job that permanently deletes
   any article (news post) whose `created_at` timestamp is more than 3 days old.
   This runs entirely in the database via the pg_cron extension — no external
   service or manual intervention required.

2. Changes
   - Enables the `pg_cron` extension in the `extensions` schema (if not already enabled).
   - Schedules a cron job named `delete-old-articles` that runs every hour.
   - The job executes: DELETE FROM articles WHERE created_at < now() - interval '3 days'
   - Cascading deletes automatically remove associated comments (via existing FK).

3. Important Notes
   - pg_cron jobs run with elevated privileges that bypass RLS, so the deletion
     succeeds regardless of row-level security policies.
   - The job is idempotent: re-running this migration will unschedule any existing
     job with the same name before scheduling a new one.
   - Running every hour (instead of once daily) ensures articles are removed
     promptly when they cross the 3-day threshold, rather than waiting up to 24h.
*/

-- Step 1: Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Step 2: Unschedule any existing job with the same name (idempotency)
-- Use a DO block to safely handle the case where the job doesn't exist yet
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'delete-old-articles') THEN
    PERFORM cron.unschedule('delete-old-articles');
  END IF;
END
$$;

-- Step 3: Schedule the auto-delete job — runs every hour
SELECT cron.schedule(
  'delete-old-articles',
  '0 * * * *',
  $$DELETE FROM articles WHERE created_at < now() - interval '3 days'$$
);

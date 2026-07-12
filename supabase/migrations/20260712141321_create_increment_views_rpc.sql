/*
# Create increment_views RPC function

## Purpose
Allows the frontend to atomically increment the view counter on an article
without needing update policies for anon users. Uses SECURITY DEFINER so
it bypasses RLS for this specific, safe operation.

## Security
- The function only increments the views column. It cannot read or modify
  any other column or table.
- Takes a single uuid argument (article_id).
*/

CREATE OR REPLACE FUNCTION increment_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE articles SET views = views + 1 WHERE id = article_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_views(uuid) TO anon, authenticated;
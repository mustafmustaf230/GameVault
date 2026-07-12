/*
# Make article/comment author_id nullable for editorial content

## Changes
- articles.author_id: drop NOT NULL constraint (allows system/editorial articles with no author)
- comments.author_id: drop NOT NULL constraint (allows system comments)
- Drop FK constraints temporarily, re-add as SET NULL on delete

## Rationale
Editorial seed articles (from "PIXELVAULT Editorial") don't belong to a real auth user.
Making author_id nullable lets us store editorial content without a real account.
The app will display "PIXELVAULT Editorial" for articles where author_id is null.
*/

ALTER TABLE articles ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE comments ALTER COLUMN author_id DROP NOT NULL;
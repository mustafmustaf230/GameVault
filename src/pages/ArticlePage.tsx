import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Article, Comment, Profile } from "../types";
import { PLATFORM_ICONS, PLATFORM_COLORS, CATEGORY_COLORS, timeAgo, timeRemaining } from "../lib/utils";
import { Eye, Clock, ArrowLeft, Send, Trash2, Crown, Lock } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { session, profile } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<(Comment & { author?: Profile })[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: articleData } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (!articleData) { setLoading(false); return; }
      setArticle(articleData);
      await supabase.rpc("increment_views", { article_id: id });
      const { data: commentData } = await supabase
        .from("comments")
        .select("*, author:profiles!comments_author_id_fkey(*)")
        .eq("article_id", id)
        .order("created_at", { ascending: false });
      setComments(commentData || []);
      setLoading(false);
    })();
  }, [id]);

  const postComment = async () => {
    if (!session || !profile?.is_premium || !newComment.trim()) return;
    setPosting(true);
    setError("");
    const { data, error } = await supabase
      .from("comments")
      .insert({ article_id: id, body: newComment.trim(), author_id: session.user.id })
      .select("*, author:profiles!comments_author_id_fkey(*)")
      .maybeSingle();
    if (error) { setError(error.message); }
    else if (data) { setComments([data as any, ...comments]); setNewComment(""); }
    setPosting(false);
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (!error) setComments(comments.filter(c => c.id !== commentId));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="aspect-[16/9] rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-neutral-500">{t("article.noArticles")}</p>
        <Link to="/news" className="mt-4 inline-block text-primary-600 hover:underline">← {t("nav.news")}</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" /> {t("nav.news")}
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <span className={`badge ${PLATFORM_COLORS[article.platform]}`}>{PLATFORM_ICONS[article.platform]} {t(`platform.${article.platform}`)}</span>
          <span className={`badge ${CATEGORY_COLORS[article.category]}`}>{t(`category.${article.category}`)}</span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-neutral-900 dark:text-white sm:text-4xl">{article.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {article.views} {t("article.views")}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {timeAgo(article.created_at, i18n.language)}</span>
          <span className="text-neutral-400" title={t("article.autoDeleteNote")}>⏳ {timeRemaining(article.created_at)}</span>
        </div>

        {article.cover_image_url && (
          <div className="mt-6 overflow-hidden rounded-xl">
            <img src={article.cover_image_url} alt={article.title} className="w-full object-cover" />
          </div>
        )}

        {article.summary && <p className="mt-6 text-lg font-medium text-neutral-700 dark:text-neutral-300">{article.summary}</p>}

        <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none">
          <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300 leading-relaxed">{article.body}</p>
        </div>

        <div className="mt-6 rounded-lg bg-neutral-100 px-4 py-3 text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          ⏳ {t("article.autoDeleteNote")}
        </div>

        <section className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t("article.comments")} ({comments.length})</h2>

          {session ? (
            profile?.is_premium ? (
              <div className="mt-4">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t("article.writeComment")} rows={3} className="input resize-none" />
                {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
                <button onClick={postComment} disabled={!newComment.trim() || posting} className="btn-primary mt-2">
                  <Send className="h-4 w-4" /> {t("article.postComment")}
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 dark:border-accent-900/30 dark:bg-accent-900/10">
                <div className="flex items-center gap-2 text-accent-700 dark:text-accent-400">
                  <Lock className="h-4 w-4" />
                  <p className="text-sm font-medium">{t("premium.commentAnywhere")}</p>
                </div>
                <Link to="/premium" className="btn-accent mt-2 text-sm">
                  <Crown className="h-4 w-4" /> {t("premium.title")}
                </Link>
              </div>
            )
          ) : (
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <Link to="/signin" className="font-semibold text-primary-600 hover:underline">{t("nav.signin")}</Link>
                {" "}/{" "}
                <Link to="/signup" className="font-semibold text-primary-600 hover:underline">{t("nav.signup")}</Link>
              </p>
            </div>
          )}

          {comments.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">{t("article.noComments")}</p>
          ) : (
            <div className="mt-6 space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="card p-4 animate-slide-up">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        {comment.author?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{comment.author?.username || "Unknown"}</p>
                        <p className="text-xs text-neutral-400">{timeAgo(comment.created_at, i18n.language)}</p>
                      </div>
                    </div>
                    {comment.author_id === session?.user?.id && (
                      <button onClick={() => deleteComment(comment.id)} className="text-neutral-400 hover:text-error-500"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}

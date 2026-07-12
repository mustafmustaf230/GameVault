import { useState, useEffect } from 'react';
import { Send, Loader2, Lock, Crown, Trash2, MessageCircle } from 'lucide-react';
import { supabase, type Comment, type Profile } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useLang } from '../lib/language';

export function CommentSection({ articleId }: { articleId: string }) {
  const { user, profile } = useAuth();
  const { t } = useLang();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  async function loadComments() {
    setLoading(true);
    const { data } = await supabase
      .from('comments')
      .select(`
        id, article_id, author_id, body, created_at,
        author:profiles(username, avatar_url)
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });
    setComments((data as unknown as Comment[]) ?? []);
    setLoading(false);
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || body.trim().length < 10) return;
    setPosting(true);
    setError(null);
    const { error } = await supabase
      .from('comments')
      .insert({ article_id: articleId, body: body.trim() });
    setPosting(false);
    if (error) {
      setError(t('commentError'));
    } else {
      setBody('');
      await loadComments();
    }
  }

  async function deleteComment(id: string) {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) await loadComments();
  }

  const isPremium = profile?.is_premium ?? false;
  const visibleComments = showAll ? comments : comments.slice(0, 5);

  return (
    <div className="mt-10">
      <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
        <MessageCircle size={20} className="text-emerald-400" />
        {t('comments')} ({comments.length})
      </h3>

      {user && isPremium ? (
        <form onSubmit={postComment} className="mb-6">
          <div className="flex gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {profile?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t('writeComment')}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all resize-none"
              />
              {body.length > 0 && body.length < 10 && (
                <p className="text-xs text-amber-400 mt-1">{t('minChars')}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={posting || body.trim().length < 10}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-medium hover:from-emerald-400 hover:to-cyan-500 transition-all disabled:opacity-50"
                >
                  {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {t('postComment')}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : !isPremium ? (
        <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Lock size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-300">{t('commentsLocked')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('upgradeToComment')}</p>
          </div>
          <Crown size={24} className="text-amber-400/50 shrink-0" />
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-slate-500" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">{t('noComments')}</p>
      ) : (
        <div className="space-y-4">
          {visibleComments.map((c) => {
            const author = c.author as unknown as Pick<Profile, 'username' | 'avatar_url'> | null;
            return (
              <div key={c.id} className="flex gap-3 group">
                {author?.avatar_url ? (
                  <img src={author.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold shrink-0">
                    {author?.username?.[0]?.toUpperCase() ?? 'A'}
                  </div>
                )}
                <div className="flex-1 bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200">
                      {author?.username ?? 'Anonymous'}
                    </span>
                    {c.author_id === user?.id && (
                      <button onClick={() => deleteComment(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5">{new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
          {comments.length > 5 && !showAll && (
            <button onClick={() => setShowAll(true)} className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 py-2 transition-colors">
              {t('showAll')} ({comments.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

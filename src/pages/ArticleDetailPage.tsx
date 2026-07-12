import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Clock, Loader2, Tag, Share2, Crown } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import { getPlatform } from '../lib/platforms';
import { CommentSection } from '../components/CommentSection';
import { useLang } from '../lib/language';

export function ArticleDetailPage({ articleId, onBack }: { articleId: string; onBack: () => void }) {
  const { t } = useLang();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase.from('articles').select('*').eq('id', articleId).maybeSingle().then(({ data }) => {
      if (!mounted) return;
      setArticle((data as Article) ?? null);
      setLoading(false);
      if (data) {
        supabase.rpc('increment_views', { article_id: articleId }).then(() => {});
        const a = data as Article;
        supabase
          .from('articles')
          .select('*')
          .eq('platform', a.platform)
          .neq('id', articleId)
          .order('created_at', { ascending: false })
          .limit(3)
          .then(({ data: rel }) => mounted && setRelated((rel as Article[]) ?? []));
      }
    });
    return () => { mounted = false; };
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-slate-400 mb-4">{t('noArticles')}</p>
        <button onClick={onBack} className="text-emerald-400 hover:text-emerald-300 text-sm">{t('back')}</button>
      </div>
    );
  }

  const platform = getPlatform(article.platform);
  const Icon = platform.icon;

  return (
    <div>
      {/* Hero cover */}
      <div className="relative h-[50vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

        <div className="absolute top-4 left-4 sm:left-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-slate-200 hover:bg-black/70 text-sm transition-colors border border-white/10"
          >
            <ArrowLeft size={16} /> {t('closeArticle')}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r ${platform.gradient} text-white text-xs font-bold uppercase tracking-wide`}>
                <Icon size={13} /> {platform.label}
              </span>
              <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase border border-amber-500/30 backdrop-blur-sm">
                {article.category}
              </span>
              {article.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30 backdrop-blur-sm">
                  <Crown size={11} /> {t('featured')}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight max-w-3xl">{article.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> {article.views + 1} {t('views')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-lg text-slate-300 leading-relaxed font-medium mb-6 pb-6 border-b border-slate-800">
          {article.summary}
        </p>

        <div className="prose-content space-y-4 text-slate-300 leading-relaxed">
          {article.body.split('\n').map((para, i) => (
            <p key={i} className="text-[15px] leading-[1.8]">{para}</p>
          ))}
        </div>

        {/* Tags + share */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-400 text-xs border border-slate-700/30">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              if (navigator.share) navigator.share({ title: article.title, url: window.location.href });
              else navigator.clipboard?.writeText(window.location.href);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm transition-colors border border-slate-700/30"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Comments */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <CommentSection articleId={article.id} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white mb-5">{t('relatedNews')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => {
                const rp = getPlatform(r.platform);
                const RIcon = rp.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onBack();
                      setTimeout(() => window.scrollTo(0, 0), 0);
                    }}
                    className="group text-left rounded-xl overflow-hidden bg-slate-800/40 border border-slate-700/30 hover:border-slate-600 transition-all"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gradient-to-r ${rp.gradient} text-white text-[9px] font-bold uppercase`}>
                        <RIcon size={9} /> {rp.label}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-slate-200 font-medium line-clamp-2 group-hover:text-emerald-400 transition-colors">{r.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

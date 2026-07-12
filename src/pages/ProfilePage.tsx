import { useState, useEffect } from 'react';
import { Crown, Calendar, Edit2, Save, X, Loader2, Award, FileText } from 'lucide-react';
import { supabase, type Article } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useLang } from '../lib/language';
import { ArticleCard } from '../components/ArticleCard';

type Props = {
  onOpenArticle: (id: string) => void;
  onNavigate: (view: 'upgrade') => void;
};

export function ProfilePage({ onOpenArticle, onNavigate }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLang();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('articles')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setArticles((data as Article[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  if (!user || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-slate-400">{t('signIn')}</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ bio: bio.trim() || null, avatar_url: avatarUrl.trim() || null })
      .eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  };

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-blue-600/20 relative">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.4), transparent 50%), radial-gradient(circle at 70% 50%, rgba(59,130,246,0.4), transparent 50%)' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="flex items-end gap-4">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-800 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-800 shadow-xl">
                  {profile.username[0]?.toUpperCase()}
                </div>
              )}
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.username}
                  {profile.is_premium && <Crown size={20} className="text-amber-400" />}
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                  <Calendar size={13} /> {t('memberSince')} {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {editing ? (
              <div className="flex items-center gap-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {t('save')}
                </button>
                <button onClick={() => { setEditing(false); setBio(profile.bio ?? ''); setAvatarUrl(profile.avatar_url ?? ''); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
                  <X size={14} /> {t('cancel')}
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
                <Edit2 size={14} /> {t('editProfile')}
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('avatarUrl')}</label>
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500/50 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('bio')}</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500/50 outline-none resize-none" placeholder="Tell the community about yourself" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed">{profile.bio || 'No bio yet.'}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/30">
              <FileText size={16} className="text-emerald-400 mb-1.5" />
              <p className="text-2xl font-bold text-white">{articles.length}</p>
              <p className="text-xs text-slate-500">Articles</p>
            </div>
            <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/30">
              <Award size={16} className="text-cyan-400 mb-1.5" />
              <p className="text-2xl font-bold text-white">{totalViews}</p>
              <p className="text-xs text-slate-500">Total Views</p>
            </div>
            <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/30">
              <Crown size={16} className="text-amber-400 mb-1.5" />
              <p className="text-2xl font-bold text-white">{profile.is_premium ? 'PRO' : 'FREE'}</p>
              <p className="text-xs text-slate-500">Status</p>
            </div>
          </div>

          {!profile.is_premium && (
            <button
              onClick={() => onNavigate('upgrade')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
            >
              <Crown size={16} /> {t('upgradeNow')}
            </button>
          )}
        </div>
      </div>

      {/* My articles */}
      <h2 className="text-lg font-bold text-white mb-4">{t('myArticles')}</h2>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-slate-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <FileText size={32} className="mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">{t('noOwnArticles')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} onClick={() => onOpenArticle(a.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Crown, Check, Loader2, MessageCircle, BadgeCheck, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useLang } from '../lib/language';

export function UpgradePage({ onNavigate }: { onNavigate: (view: 'home') => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [showStripeMsg, setShowStripeMsg] = useState(false);
  const [demoActivated, setDemoActivated] = useState(false);

  const benefits = [
    { icon: MessageCircle, text: t('benefit1') },
    { icon: BadgeCheck, text: t('benefit3') },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    setShowStripeMsg(true);
    setLoading(false);
  };

  const handleDemoActivate = async () => {
    if (!user) return;
    setLoading(true);
    await supabase
      .from('profiles')
      .update({ is_premium: true, premium_expires_at: new Date(Date.now() + 30 * 86400000).toISOString() })
      .eq('id', user.id);
    await refreshProfile();
    setLoading(false);
    setDemoActivated(true);
    setTimeout(() => onNavigate('home'), 1500);
  };

  if (profile?.is_premium) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <Crown size={36} className="text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{t('premiumMember')}</h1>
        <p className="text-slate-400 mb-6">You have access to all Premium features.</p>
        <button onClick={() => onNavigate('home')} className="px-6 py-2.5 rounded-lg bg-slate-800/60 text-slate-200 text-sm font-medium border border-slate-700/50 hover:bg-slate-700/60 transition-colors">
          {t('home')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-4">
          <Sparkles size={14} /> {t('premium')}
        </div>
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/20">
          <Crown size={36} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t('premiumTitle')}</h1>
        <p className="text-slate-400 max-w-md mx-auto">{t('premiumDesc')}</p>
      </div>

      {/* Pricing card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-amber-500/20 overflow-hidden max-w-md mx-auto">
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
        <div className="p-8">
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-5xl font-extrabold text-white">$2</span>
            <span className="text-slate-400 text-sm">/{t('perMonth')}</span>
          </div>

          <div className="space-y-3 mb-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-amber-400" />
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed pt-0.5">{b.text}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} />}
            {t('subscribe')}
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">Cancel anytime. Secure payment via Stripe.</p>
        </div>
      </div>

      {/* Demo activation */}
      {!user && (
        <p className="text-center text-sm text-slate-500 mt-6">
          {t('signUp')} to subscribe
        </p>
      )}
      {user && !demoActivated && (
        <div className="text-center mt-6">
          <button onClick={handleDemoActivate} disabled={loading} className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-2">
            Activate demo premium (for testing)
          </button>
        </div>
      )}
      {demoActivated && (
        <div className="text-center mt-6">
          <p className="text-sm text-emerald-400 flex items-center justify-center gap-1.5">
            <Check size={16} /> Premium activated! Redirecting...
          </p>
        </div>
      )}

      {/* Stripe onboarding modal */}
      {showStripeMsg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowStripeMsg(false)}>
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Set up payments</h3>
              <button onClick={() => setShowStripeMsg(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              To process real payments, we need to connect a Stripe account. Once configured, you will be able to accept $2/month subscriptions securely.
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Until then, you can use the demo activation button above to test Premium features for free.
            </p>
            <button onClick={() => setShowStripeMsg(false)} className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700 hover:bg-slate-700 transition-colors">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

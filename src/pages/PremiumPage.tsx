import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Crown, MessageSquare, Heart, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PremiumPage() {
  const { t } = useTranslation();
  const { session, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subscribe = async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: true, premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })
      .eq("id", session.user.id);
    if (error) setError(error.message);
    else await refreshProfile();
    setLoading(false);
  };

  const cancelSubscription = async () => {
    if (!session) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: false, premium_expires_at: null })
      .eq("id", session.user.id);
    if (!error) await refreshProfile();
    setLoading(false);
  };

  const features = [
    { icon: MessageSquare, text: t("premium.commentAnywhere") },
    { icon: Heart, text: t("premium.supportCommunity") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-500/30">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-900 dark:text-white">{t("premium.title")}</h1>
        <p className="mt-2 text-lg text-neutral-500">{t("tagline")}</p>
        <p className="mt-4 font-display text-5xl font-bold text-neutral-900 dark:text-white">{t("premium.price")}</p>
      </div>

      {profile?.is_premium ? (
        <div className="mt-8 rounded-2xl border border-success-200 bg-success-50 p-8 text-center dark:border-success-900/30 dark:bg-success-900/10">
          <Crown className="mx-auto h-12 w-12 text-accent-500" />
          <p className="mt-3 text-xl font-bold text-success-700 dark:text-success-400">{t("premium.youArePremium")}</p>
          <button onClick={cancelSubscription} disabled={loading} className="btn-outline mt-4">{loading ? "..." : t("premium.cancelBtn")}</button>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{t("premium.features")}</h2>
          <ul className="mt-4 space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <feature.icon className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-neutral-700 dark:text-neutral-300">{feature.text}</span>
                <Check className="ml-auto h-5 w-5 text-success-500" />
              </li>
            ))}
          </ul>
          {error && <p className="mt-4 text-sm text-error-500">{error}</p>}
          {session ? (
            <button onClick={subscribe} disabled={loading} className="btn-accent mt-6 w-full text-base py-3">
              <Crown className="h-5 w-5" /> {loading ? "..." : t("premium.subscribeBtn")}
            </button>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Link to="/signin" className="btn-primary w-full">{t("nav.signin")}</Link>
              <Link to="/signup" className="btn-outline w-full">{t("nav.signup")}</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

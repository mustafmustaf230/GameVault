import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import type { Article } from "../types";
import ArticleCard from "../components/ArticleCard";
import { PLATFORMS, PLATFORM_ICONS } from "../lib/utils";
import { ArrowRight, Zap, Shield, Globe as Globe2, Clock } from "lucide-react";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(9);
      if (error) console.error("Fetch error:", error);
      setArticles(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-neutral-950 to-neutral-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(51,164,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(249,115,22,0.2) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <Zap className="h-4 w-4 text-accent-400" />
              <span>{t("tagline")}</span>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{t("hero.title")}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">{t("hero.subtitle")}</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/news" className="btn-primary text-base px-6 py-3">{t("hero.cta")} <ArrowRight className="h-5 w-5" /></Link>
              <Link to="/premium" className="btn text-base px-6 py-3 text-white border border-white/30 hover:bg-white/10">{t("nav.premium")}</Link>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {PLATFORMS.map(p => (
              <Link key={p} to={`/news?platform=${p}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-neutral-200 transition-all hover:border-primary-400 hover:bg-primary-500/20 hover:text-white">
                <span>{PLATFORM_ICONS[p]}</span>{t(`platform.${p}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Globe2 className="h-5 w-5 text-primary-600" />
            </div>
            <div><p className="text-sm font-semibold text-neutral-900 dark:text-white">17 Languages</p><p className="text-xs text-neutral-500">Including Kurdish</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/30">
              <Shield className="h-5 w-5 text-accent-600" />
            </div>
            <div><p className="text-sm font-semibold text-neutral-900 dark:text-white">$2/month Premium</p><p className="text-xs text-neutral-500">Comment & publish</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
              <Clock className="h-5 w-5 text-success-600" />
            </div>
            <div><p className="text-sm font-semibold text-neutral-900 dark:text-white">3-Day Cycle</p><p className="text-xs text-neutral-500">Fresh news always</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">{t("nav.news")}</h2>
          <Link to="/news" className="text-sm font-semibold text-primary-600 hover:text-primary-700">{t("article.readMore")} →</Link>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="aspect-[16/9] bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="mt-6 text-center text-neutral-500">{t("article.noArticles")}</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => <ArticleCard key={article.id} article={article} lang={i18n.language} />)}
          </div>
        )}
      </section>
    </div>
  );
}

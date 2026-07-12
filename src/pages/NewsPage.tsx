import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import type { Article, Platform } from "../types";
import ArticleCard from "../components/ArticleCard";
import { PLATFORMS, PLATFORM_ICONS } from "../lib/utils";
import { Search } from "lucide-react";

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const platform = (searchParams.get("platform") || "all") as string;

  useEffect(() => {
    setLoading(true);
    (async () => {
      let query = supabase.from("articles").select("*").order("created_at", { ascending: false });
      if (platform !== "all") query = query.eq("platform", platform as Platform);
      if (search) query = query.ilike("title", `%${search}%`);
      const { data, error } = await query.limit(50);
      if (error) console.error("Fetch error:", error);
      setArticles(data || []);
      setLoading(false);
    })();
  }, [platform, search]);

  const setPlatform = (p: string) => {
    if (p === "all") setSearchParams({});
    else setSearchParams({ platform: p });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">{t("nav.news")}</h1>

      <div className="relative mt-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setPlatform("all")} className={`badge px-3 py-1.5 transition-all ${platform === "all" ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300"}`}>{t("platform.all")}</button>
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setPlatform(p)} className={`badge px-3 py-1.5 transition-all ${platform === p ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300"}`}>
            {PLATFORM_ICONS[p]} {t(`platform.${p}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse overflow-hidden">
              <div className="aspect-[16/9] bg-neutral-200 dark:bg-neutral-800" />
              <div className="p-4 space-y-3"><div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" /><div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" /></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="mt-12 text-center text-neutral-500">{t("article.noArticles")}</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => <ArticleCard key={article.id} article={article} lang={i18n.language} />)}
        </div>
      )}
    </div>
  );
}

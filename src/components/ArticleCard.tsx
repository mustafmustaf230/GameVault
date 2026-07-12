import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, Clock } from "lucide-react";
import type { Article } from "../types";
import { PLATFORM_ICONS, PLATFORM_COLORS, CATEGORY_COLORS, timeAgo, timeRemaining } from "../lib/utils";

export default function ArticleCard({ article, lang }: { article: Article; lang: string }) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/article/${article.id}`}
      className="group card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {article.cover_image_url ? (
          <img src={article.cover_image_url} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">{PLATFORM_ICONS[article.platform]}</div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge ${PLATFORM_COLORS[article.platform]} backdrop-blur-sm`}>
            {PLATFORM_ICONS[article.platform]} {t(`platform.${article.platform}`)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`badge ${CATEGORY_COLORS[article.category]} backdrop-blur-sm`}>
            {t(`category.${article.category}`)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 transition-colors group-hover:text-primary-600 dark:text-white">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{article.summary}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.views}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {timeAgo(article.created_at, lang)}</span>
          </div>
          <span className="text-neutral-400" title={t("article.autoDeleteNote")}>{timeRemaining(article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

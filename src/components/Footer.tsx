import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 dark:bg-white">
                <svg viewBox="0 0 64 64" className="h-5 w-5">
                  <path d="M16 22 L32 14 L48 22 L48 42 L32 50 L16 42 Z" fill="none" stroke="#33a4ff" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M24 28 L32 24 L40 28 L40 38 L32 42 L24 38 Z" fill="#33a4ff" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold">{t("brand")}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">{t("footer.about")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t("nav.news")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link to="/news?platform=playstation" className="hover:text-primary-600">PlayStation</Link></li>
              <li><Link to="/news?platform=xbox" className="hover:text-primary-600">Xbox</Link></li>
              <li><Link to="/news?platform=nintendo" className="hover:text-primary-600">Nintendo</Link></li>
              <li><Link to="/news?platform=pc" className="hover:text-primary-600">PC</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t("brand")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link to="/premium" className="hover:text-primary-600">{t("nav.premium")}</Link></li>
              <li><Link to="/signin" className="hover:text-primary-600">{t("nav.signin")}</Link></li>
              <li><Link to="/signup" className="hover:text-primary-600">{t("nav.signup")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p className="text-center text-xs text-neutral-400">© {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}

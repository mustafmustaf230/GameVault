import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { LANGS } from "../i18n";
import { Globe, Menu, X, Crown, SquarePen as PenSquare, LogOut } from "lucide-react";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 dark:bg-white">
            <svg viewBox="0 0 64 64" className="h-6 w-6">
              <path d="M16 22 L32 14 L48 22 L48 42 L32 50 L16 42 Z" fill="none" stroke="#33a4ff" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M24 28 L32 24 L40 28 L40 38 L32 42 L24 38 Z" fill="#33a4ff" />
              <circle cx="32" cy="33" r="3" fill="#0f172a" className="dark:fill-white" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-neutral-950 dark:text-white">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="btn-ghost">{t("nav.home")}</Link>
          <Link to="/news" className="btn-ghost">{t("nav.news")}</Link>
          {profile?.is_admin && (
            <Link to="/publish" className="btn-ghost">
              <PenSquare className="h-4 w-4" /> {t("nav.publish")}
            </Link>
          )}
          <Link to="/premium" className="btn-ghost">
            <Crown className="h-4 w-4 text-accent-500" /> {t("nav.premium")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="btn-ghost px-2.5">
              <Globe className="h-4 w-4" />
              <span className="text-sm">{currentLang.flag}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 max-h-80 w-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${i18n.language === lang.code ? "font-semibold text-primary-600" : "text-neutral-700 dark:text-neutral-300"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {session ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </div>
                {profile?.is_premium && <Crown className="h-4 w-4 text-accent-500" />}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{profile?.username}</p>
                    {profile?.is_premium && <p className="text-xs text-accent-500">{t("premium.active")}</p>}
                  </div>
                  <button onClick={() => { setUserMenuOpen(false); navigate("/premium"); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                    <Crown className="h-4 w-4" /> {t("nav.premium")}
                  </button>
                  <button onClick={() => { setUserMenuOpen(false); signOut(); navigate("/"); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                    <LogOut className="h-4 w-4" /> {t("nav.signout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/signin" className="btn-outline">{t("nav.signin")}</Link>
              <Link to="/signup" className="btn-primary">{t("nav.signup")}</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost md:hidden p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 md:hidden">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-neutral-700 dark:text-neutral-300">{t("nav.home")}</Link>
          <Link to="/news" onClick={() => setMobileOpen(false)} className="block py-2 text-neutral-700 dark:text-neutral-300">{t("nav.news")}</Link>
          {profile?.is_admin && <Link to="/publish" onClick={() => setMobileOpen(false)} className="block py-2 text-neutral-700 dark:text-neutral-300">{t("nav.publish")}</Link>}
          <Link to="/premium" onClick={() => setMobileOpen(false)} className="block py-2 text-neutral-700 dark:text-neutral-300">{t("nav.premium")}</Link>
          {!session && (
            <div className="mt-2 flex gap-2">
              <Link to="/signin" onClick={() => setMobileOpen(false)} className="btn-outline flex-1">{t("nav.signin")}</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">{t("nav.signup")}</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

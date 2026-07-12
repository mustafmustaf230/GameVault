import type { Platform, Category } from "../types";

export const PLATFORMS: Platform[] = [
  "playstation", "xbox", "nintendo", "pc", "handheld", "mobile", "component", "vr", "retro", "esports", "general",
];

export const CATEGORIES: Category[] = ["news", "review", "rumor", "guide", "opinion"];

export const PLATFORM_ICONS: Record<Platform, string> = {
  playstation: "🎮", xbox: "🎯", nintendo: "🔴", pc: "💻", handheld: "📱",
  mobile: "📲", component: "⚙️", vr: "🥽", retro: "👾", esports: "🏆", general: "📰",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  playstation: "bg-blue-100 text-blue-700", xbox: "bg-green-100 text-green-700",
  nintendo: "bg-red-100 text-red-700", pc: "bg-neutral-100 text-neutral-700",
  handheld: "bg-orange-100 text-orange-700", mobile: "bg-yellow-100 text-yellow-700",
  component: "bg-purple-100 text-purple-700", vr: "bg-teal-100 text-teal-700",
  retro: "bg-pink-100 text-pink-700", esports: "bg-amber-100 text-amber-700",
  general: "bg-gray-100 text-gray-700",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  news: "bg-primary-100 text-primary-700",
  review: "bg-success-100 text-success-700",
  rumor: "bg-warning-100 text-warning-700",
  guide: "bg-accent-100 text-accent-700",
  opinion: "bg-neutral-200 text-neutral-700",
};

export function timeAgo(date: string, lang: string = "en"): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (lang === "ku" || lang === "ar" || lang === "fa") {
    if (days > 0) return `پێش ${days} ڕۆژ`;
    if (hours > 0) return `پێش ${hours} کاتژمێر`;
    if (minutes > 0) return `پێش ${minutes} خولەک`;
    return `ئێستا`;
  }

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function timeRemaining(date: string): string {
  const created = new Date(date).getTime();
  const expires = created + 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const remaining = expires - now;
  if (remaining <= 0) return "expired";
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  return `${hours}h left`;
}

import { Gamepad2, Disc2, Laptop, Glasses, Smartphone, Trophy, Disc3, Cpu } from 'lucide-react';

export type PlatformInfo = {
  key: string;
  label: string;
  icon: typeof Gamepad2;
  color: string;
  gradient: string;
};

export const PLATFORMS: PlatformInfo[] = [
  { key: 'all', label: 'All', icon: Gamepad2, color: 'text-slate-300', gradient: 'from-slate-600 to-slate-800' },
  { key: 'playstation', label: 'PlayStation', icon: Gamepad2, color: 'text-blue-400', gradient: 'from-blue-600 to-blue-900' },
  { key: 'xbox', label: 'Xbox', icon: Disc2, color: 'text-green-400', gradient: 'from-green-600 to-green-900' },
  { key: 'nintendo', label: 'Nintendo', icon: Gamepad2, color: 'text-red-400', gradient: 'from-red-500 to-rose-800' },
  { key: 'pc', label: 'PC', icon: Laptop, color: 'text-cyan-400', gradient: 'from-cyan-500 to-teal-900' },
  { key: 'handheld', label: 'Handheld', icon: Gamepad2, color: 'text-orange-400', gradient: 'from-orange-500 to-amber-800' },
  { key: 'component', label: 'Components', icon: Cpu, color: 'text-purple-400', gradient: 'from-purple-500 to-violet-900' },
  { key: 'vr', label: 'VR', icon: Glasses, color: 'text-teal-400', gradient: 'from-teal-500 to-cyan-900' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-pink-400', gradient: 'from-pink-500 to-rose-900' },
  { key: 'retro', label: 'Retro', icon: Disc3, color: 'text-yellow-400', gradient: 'from-yellow-500 to-amber-900' },
  { key: 'esports', label: 'Esports', icon: Trophy, color: 'text-amber-400', gradient: 'from-amber-500 to-orange-900' },
];

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'review', label: 'Review' },
  { key: 'rumor', label: 'Rumor' },
  { key: 'guide', label: 'Guide' },
  { key: 'opinion', label: 'Opinion' },
];

export function getPlatform(key: string): PlatformInfo {
  return PLATFORMS.find((p) => p.key === key) ?? PLATFORMS[0];
}

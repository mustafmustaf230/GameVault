import { Vault } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-14 h-14' };
  const text = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  const icon = { sm: 16, md: 20, lg: 30 };

  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`${dims[size]} rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30`}>
        <Vault size={icon[size]} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${text[size]} font-extrabold tracking-tight text-white`}>
        PIXEL<span className="text-emerald-400">VAULT</span>
      </span>
    </div>
  );
}

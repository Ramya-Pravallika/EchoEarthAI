import React from "react";
import { Sparkles, Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <Leaf className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
        <span className="font-semibold text-lg tracking-tight text-gray-950 dark:text-zinc-50 flex items-center gap-1.5">
          EchoEarth AI
          <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
            Beta
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full font-medium">
          <Sparkles size={13} className="animate-pulse" />
          Living Biome Calibration
        </div>
      </div>
    </header>
  );
}
export default Header;

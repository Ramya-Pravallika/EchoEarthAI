import React from "react";
import { TreePine, Calendar, BookOpen, Users, Compass, ShieldCheck } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col gap-6 hidden md:flex">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs uppercase font-semibold text-gray-400 dark:text-zinc-500 tracking-wider">Navigation</span>
        <nav className="flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-medium rounded-lg text-sm cursor-pointer">
            <TreePine size={18} />
            Ecosystem Biome
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-sm cursor-pointer transition-colors">
            <Calendar size={18} />
            Pledged Interventions
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-sm cursor-pointer transition-colors">
            <BookOpen size={18} />
            Reflection Journal
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg text-sm cursor-pointer transition-colors">
            <Users size={18} />
            Community Actions
          </div>
        </nav>
      </div>
      <div className="mt-auto border-t border-gray-100 dark:border-zinc-800 pt-4 flex gap-3.5 items-center">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">Verified Biome</span>
          <span className="text-[10px] text-gray-400">GDPR & Carbon Safe</span>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;

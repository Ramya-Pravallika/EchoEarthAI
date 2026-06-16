import { Sparkles, Sparkle } from "lucide-react";
import { CarbonReflection } from "../../../types";

interface CarbonIdentityCardProps {
  reflection: CarbonReflection;
  isTwilightMode: boolean;
}

export default function CarbonIdentityCard({
  reflection,
  isTwilightMode,
}: CarbonIdentityCardProps) {
  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const bodyTextClass = isTwilightMode ? "text-slate-300" : "text-stone-700 font-serif";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  return (
    <div
      id="personalized-identity-card"
      className={`rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 ${
        isTwilightMode
          ? "bg-gradient-to-br from-[#12181F] to-[#0A0D14] border border-[#232A31] text-white"
          : "bg-gradient-to-br from-[#EFECE6] to-[#E5E0D5] border border-[#C6C0B4] text-stone-900"
      }`}
    >
      <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none select-none">
        <Sparkles className="w-40 h-40 text-emerald-700/20" />
      </div>

      <div className="space-y-3.5 relative z-10">
        <span
          className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest inline-flex items-center gap-1.5 border ${
            isTwilightMode
              ? "bg-amber-400/20 border-amber-400/30 text-amber-300"
              : "bg-emerald-800/10 border-emerald-800/20 text-emerald-800"
          }`}
        >
          <Sparkle className="w-3.5 h-3.5 animate-spin-slow" /> Your Carbon Reflection Identity
        </span>
        <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${titleTextClass}`}>
          {reflection.carbonIdentity.title}
        </h3>
        <p className={`text-sm md:text-base leading-relaxed ${bodyTextClass}`}>
          {reflection.carbonIdentity.description}
        </p>

        <div className="pt-4 border-t border-stone-400/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className={`text-[10px] uppercase font-bold tracking-widest block ${mutedTextClass}`}>
              Dominant Footprint Contributor
            </span>
            <span className="text-sm font-bold text-amber-600">
              {reflection.carbonIdentity.dominantHabit}
            </span>
          </div>
          <p className={`text-xs max-w-sm md:text-right italic ${bodyTextClass}`}>
            {reflection.carbonIdentity.contributorExplanation}
          </p>
        </div>
      </div>
    </div>
  );
}
export { CarbonIdentityCard };

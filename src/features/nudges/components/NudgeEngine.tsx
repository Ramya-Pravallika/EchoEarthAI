import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, Lightbulb, RefreshCw } from "lucide-react";

interface Nudge {
  title: string;
  description: string;
  category: "transportation" | "food" | "energy" | "shopping" | "waste";
  impactLevel: "Low" | "Medium" | "High";
}

interface NudgeEngineProps {
  identityTitle: string;
  breakdown: {
    transportation: number;
    food: number;
    energy: number;
    shopping: number;
    waste: number;
  };
  adoptedIds: string[];
  isTwilightMode: boolean;
}

export default function NudgeEngine({
  identityTitle,
  breakdown,
  adoptedIds,
  isTwilightMode,
}: NudgeEngineProps) {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNudges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identityTitle, breakdown, adoptedIds }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.nudges && Array.isArray(data.nudges)) {
          setNudges(data.nudges);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to fetch fresh nudges, using fallback", e);
    }

    // Fallbacks
    const defaultNudges: Nudge[] = [
      {
        title: "Dine Mindfully this Weekend",
        description: "Your diet represents a vital pillar of emissions. Replacing beef with plant-protein or locally sourced items today can reduce your food footprint by 40%.",
        category: "food",
        impactLevel: "Medium",
      },
      {
        title: "Power Down Household Devices",
        description: "Unplugging vampire chargers and using active power strip switches is a micro win that compounds into substantial monthly electricity reductions.",
        category: "energy",
        impactLevel: "Low",
      },
      {
        title: "Active Local Transit Shift",
        description: "Your transportation is a major carbon source. Walking or hybrid-carsharing for trips under 2 miles keeps your eco-vitality ticking beautifully.",
        category: "transportation",
        impactLevel: "High",
      },
    ];
    setNudges(defaultNudges);
    setLoading(false);
  };

  useEffect(() => {
    fetchNudges();
  }, [breakdown, adoptedIds]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "transportation": return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
      case "food": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "energy": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "shopping": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div
      id="nudge-engine-component"
      className={`p-6 rounded-2xl border transition-all duration-500 space-y-4 ${
        isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h4 className={`font-bold tracking-tight text-base flex items-center gap-2 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <Lightbulb className="w-5 h-5 text-amber-500" /> AI Behavior Nudges
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Timely contextual prompts tailored to your carbon identity.
          </p>
        </div>
        <button
          id="btn-refresh-nudges"
          onClick={fetchNudges}
          disabled={loading}
          className={`p-2 rounded-xl border transition-all hover:bg-black/5 disabled:opacity-50 ${
            isTwilightMode ? "border-[#232A31] text-slate-400" : "border-[#E4E2DB] text-stone-600"
          }`}
          title="Refresh Nudges"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {nudges.map((nudge, i) => (
            <motion.div
              key={`${nudge.title}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                isTwilightMode
                  ? "bg-[#161D26] border-[#222E3C]/60 hover:border-slate-500"
                  : "bg-white border-[#E4E2DB] hover:border-stone-400"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold uppercase py-0.5 px-1.5 rounded-md border ${getCategoryColor(nudge.category)}`}>
                    {nudge.category}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    nudge.impactLevel === "High" ? "text-rose-500" : nudge.impactLevel === "Medium" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {nudge.impactLevel} Impact nudge
                  </span>
                </div>

                <h5 className={`text-sm font-bold tracking-tight ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
                  {nudge.title}
                </h5>
                <p className={`text-xs leading-relaxed font-serif ${isTwilightMode ? "text-slate-300" : "text-stone-600"}`}>
                  {nudge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100/10 flex items-center justify-between text-[11px] font-semibold">
                <span className={isTwilightMode ? "text-slate-450 text-slate-400" : "text-stone-500"}>
                  Context Action
                </span>
                <span className="text-indigo-500 flex items-center gap-1">
                  Try this <Compass className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

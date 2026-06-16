import { Layers } from "lucide-react";
import { CarbonReflection } from "../../../types";

interface FootprintBreakdownProps {
  reflection: CarbonReflection;
  isTwilightMode: boolean;
}

export default function FootprintBreakdown({
  reflection,
  isTwilightMode,
}: FootprintBreakdownProps) {
  const cardThemeClass = isTwilightMode ? "geometric-card-dark" : "geometric-card";
  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  if (!reflection.breakdown) return null;

  return (
    <div
      id="footprint-distribution-breakdown"
      className={`${cardThemeClass} p-6 space-y-4 transition-colors duration-500`}
    >
      <h4 className={`font-bold tracking-tight text-sm flex items-center gap-1.5 ${titleTextClass}`}>
        <Layers className="w-4 h-4 text-emerald-800" /> Sector Footprint Appraisals
      </h4>

      <div className="space-y-3 pt-1">
        {[
          { key: "transportation", label: "Mobility & Aviation", color: "bg-cyan-500" },
          { key: "food", label: "Diet & Food Waste", color: "bg-emerald-600" },
          { key: "energy", label: "Home Power & Heating", color: "bg-amber-500" },
          { key: "shopping", label: "Material Purchases", color: "bg-rose-500" },
          { key: "waste", label: "Waste Disposal", color: "bg-slate-500" },
        ].map((sec) => {
          const val = (reflection.breakdown as any)[sec.key] || 0.1;
          const maxVal = Math.max(...(Object.values(reflection.breakdown || {}) as number[]));
          const widthPct = Math.max(5, (val / (maxVal || 1)) * 100);

          return (
            <div key={sec.key} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className={mutedTextClass}>{sec.label}</span>
                <span className={`font-mono ${titleTextClass}`}>{val.toFixed(1)}t</span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isTwilightMode ? "bg-slate-800" : "bg-stone-200"
                }`}
              >
                <div className={`h-full ${sec.color}`} style={{ width: `${widthPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { FootprintBreakdown };

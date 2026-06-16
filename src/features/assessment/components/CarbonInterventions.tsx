import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TreePine, ChevronDown } from "lucide-react";
import { CarbonReflection } from "../../../types";

interface CarbonInterventionsProps {
  reflection: CarbonReflection;
  adoptedInterventions: string[];
  handleToggleIntervention: (actionId: string, savings: number) => void;
  isTwilightMode: boolean;
}

export default function CarbonInterventions({
  reflection,
  adoptedInterventions,
  handleToggleIntervention,
  isTwilightMode,
}: CarbonInterventionsProps) {
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const bodyTextClass = isTwilightMode ? "text-slate-300" : "text-stone-700 font-serif";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  return (
    <div id="target-interventions-section" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
        <div>
          <h4 className={`font-bold tracking-tight text-lg flex items-center gap-1.5 ${titleTextClass}`}>
            <TreePine className="w-5 h-5 text-emerald-800" /> Actionable Carbon Interventions
          </h4>
          <p className={`text-xs ${mutedTextClass}`}>
            Open any transition program to reveal localized instructions.
          </p>
        </div>

        <span className="text-xs font-semibold text-indigo-600">
          Pledged Pacts: {adoptedInterventions.length} of {reflection.interventions.length} proposed
        </span>
      </div>

      <div className="space-y-3">
        {reflection.interventions.map((item) => {
          const isPledged = adoptedInterventions.includes(item.actionId);
          const isExpanded = expandedActionId === item.actionId;

          return (
            <div
              key={item.actionId}
              id={`intervention-accordion-${item.actionId}`}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isTwilightMode ? "bg-[#12181F]/90 border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
              }`}
            >
              <div
                onClick={() => setExpandedActionId(isExpanded ? null : item.actionId)}
                className="p-4 md:p-5 flex justify-between items-center cursor-pointer hover:bg-black/5 transition-colors select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${titleTextClass}`}>
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        isTwilightMode ? "bg-slate-800 text-slate-300" : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 text-xs flex-wrap ${mutedTextClass}`}>
                    <span>
                      CO₂ Mitigation: <strong className="text-emerald-600">-{item.co2Savings.toFixed(1)}t</strong>/yr
                    </span>
                    <span>•</span>
                    <span>
                      Cost Savings: <strong className="uppercase">{item.costSavings}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Investment Effort: <strong className="uppercase">{item.investmentEffort}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id={`btn-pledge-${item.actionId}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleIntervention(item.actionId, item.co2Savings);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border min-h-[44px] ${
                      isPledged
                        ? "bg-emerald-700 border-emerald-700 text-white"
                        : isTwilightMode
                        ? "border-[#232A31] text-slate-300 hover:bg-[#1A222B]"
                        : "border-[#E4E2DB] text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {isPledged ? "Chosen pact" : "Choose pact"}
                  </button>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-t p-5 space-y-4 ${
                      isTwilightMode ? "border-[#232A31] bg-black/20" : "border-stone-200 bg-stone-100/40"
                    }`}
                  >
                    <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
                      {item.empatheticExplanation}
                    </p>

                    <div className="space-y-2.5">
                      <h5 className={`text-[10px] uppercase font-bold tracking-widest ${mutedTextClass}`}>
                        Actionable Roadmap Checklist
                      </h5>
                      <ol className="list-decimal list-inside space-y-1.5 pl-1">
                        {item.steps.map((st, sidx) => (
                          <li key={`step-${sidx}`} className={`text-xs font-medium ${bodyTextClass}`}>
                            {st}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { CarbonInterventions };

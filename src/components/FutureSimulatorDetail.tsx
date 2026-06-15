import { useState } from "react";
import { TrendingDown, Sliders, Calendar, ChevronRight, DollarSign, Leaf } from "lucide-react";

interface FutureSimulatorDetailProps {
  currentCO2: number;
  isTwilightMode: boolean;
}

export default function FutureSimulatorDetail({
  currentCO2,
  isTwilightMode,
}: FutureSimulatorDetailProps) {
  const [timelineYears, setTimelineYears] = useState<number>(5);
  const [effortReductionPct, setEffortReductionPct] = useState<number>(35);

  const calculatedRemainingCO2 = Math.max(0.5, currentCO2 * (1 - effortReductionPct / 100));
  const totalSavedCO2 = Math.max(0, currentCO2 * (effortReductionPct / 100) * timelineYears);

  // Approximate cost actions coefficients ($320 saved per carbon ton avoided in standard practices)
  const estimatedMoneySaved = totalSavedCO2 * 320;

  // Real value conversions for Stories
  const equivalentTreeSequestrationYears = totalSavedCO2 * 45; // 45 mature trees absorb 1 ton CO2 in a year

  return (
    <div
      id="future-simulator-detail-box"
      className={`p-6 rounded-2xl border transition-all duration-500 space-y-6 ${
        isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/40 pb-4">
        <div className="space-y-0.5">
          <span className={`text-[10px] uppercase font-bold tracking-widest block text-indigo-505 text-indigo-500`}>
            ✦ Immersive Planetary Foresight ✦
          </span>
          <h4 className={`font-bold tracking-tight text-xl flex items-center gap-1.5 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <TrendingDown className="w-5.5 h-5.5 text-indigo-500 animate-pulse" /> Trajectory Futures Simulator
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Evaluate the compound effects of sustainable choices on global heating over standard timelines.
          </p>
        </div>

        {/* Timelines selection */}
        <div className={`flex p-0.5 rounded-lg text-xs ${
          isTwilightMode ? "bg-slate-900" : "bg-stone-200"
        }`}>
          {[1, 5, 10, 25].map((yr) => (
            <button
              key={`${yr}-years`}
              id={`btn-time-${yr}`}
              onClick={() => setTimelineYears(yr)}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all ${
                timelineYears === yr
                  ? isTwilightMode
                    ? "bg-[#161D26] text-amber-300"
                    : "bg-white text-emerald-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-800"
              }`}
            >
              {yr}yr
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="md:col-span-4 space-y-5">
          <div className="space-y-3">
            <h5 className={`text-xs uppercase font-extrabold tracking-widest ${
              isTwilightMode ? "text-slate-400" : "text-stone-500"
            }`}>
              Interactive Parameters
            </h5>
            <p className="text-xs font-serif leading-relaxed text-slate-400">
              Adjust your average projected reform efforts to visualize trajectories compound saving coefficients.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs font-bold font-serif text-slate-400">
              <span>Lifestyle Transition Rate</span>
              <span className="text-indigo-500 font-mono font-bold">-{effortReductionPct}% Carbon</span>
            </div>

            <input
              id="effortRange"
              type="range"
              min="5"
              max="90"
              step="5"
              value={effortReductionPct}
              onChange={(e) => setEffortReductionPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 uppercase font-bold font-mono">
              <span>Mild (5%)</span>
              <span>Committed (45%)</span>
              <span>Zero-Carbon Ready (90%)</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl space-y-2 border text-xs leading-relaxed ${
            isTwilightMode ? "bg-[#0A0D14]/70 border-[#222E3C]" : "bg-stone-50 border-stone-200 text-stone-700"
          }`}>
            <span className="font-extrabold block uppercase text-[10px] text-indigo-500">
              Current Path Trajectory
            </span>
            <span>
              Maintaining your baseline <strong>{currentCO2.toFixed(1)} metric tons</strong> / year means that over the next <strong>{timelineYears} years</strong>, you will emit a cumulative total of <strong className="text-rose-500">{(currentCO2 * timelineYears).toFixed(1)} tons CO₂e</strong>.
            </span>
          </div>
        </div>

        {/* Right Column Visualizing Trajectory Projections Cards */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Card 1: Annual Footprint */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450 block text-slate-400">
              Future Annual Standard
            </span>
            <div className="space-y-1">
              <span className={`text-4xl font-extrabold font-mono tracking-tight block ${
                isTwilightMode ? "text-stone-100" : "text-stone-900"
              }`}>
                {calculatedRemainingCO2.toFixed(1)}t
              </span>
              <span className="text-[10px] text-emerald-600 block font-bold uppercase">
                -{effortReductionPct}% Carbon Refined
              </span>
            </div>
            <p className="text-[10px] text-slate-450 font-serif leading-relaxed text-slate-400">
              Your future annual footprint with active lifestyle transitions.
            </p>
          </div>

          {/* Card 2: Cumulative mitigation */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-405 text-slate-400 block">
              Cumulative Mitigation
            </span>
            <div className="space-y-1">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-emerald-600 block">
                -{totalSavedCO2.toFixed(1)}t
              </span>
              <span className="text-[10px] text-slate-450 text-slate-400 block font-bold leading-none uppercase">
                Carbon Prevented
              </span>
            </div>
            <p className="text-[10px] font-serif leading-relaxed text-slate-400">
              Total greenhouse gas avoided over {timelineYears} years.
            </p>
          </div>

          {/* Card 3: Monetary Savings */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between col-span-2 md:col-span-1 space-y-3 ${
            isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-405 text-slate-400 block">
              Compound Economy Save
            </span>
            <div className="space-y-1">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-indigo-500 block flex items-center">
                <DollarSign className="w-6 h-6 shrink-0" />
                {Math.round(estimatedMoneySaved).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 block font-bold leading-none uppercase">
                Utility & fuel savings
              </span>
            </div>
            <p className="text-[10px] font-serif leading-relaxed text-slate-400">
              Estimated direct budget retained over {timelineYears} years.
            </p>
          </div>

          {/* Eco Emotional Narrative Comparison Panel */}
          <div className={`col-span-2 md:col-span-3 p-5 rounded-xl border flex items-start gap-4 ${
            isTwilightMode ? "bg-[#1A2534]/50 border-indigo-500/20" : "bg-emerald-50/50 border-emerald-150 border-emerald-300"
          }`}>
            <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg ${
              isTwilightMode ? "bg-[#1B2635] text-amber-300" : "bg-emerald-800 text-stone-100"
            }`}>
              🌲
            </div>

            <div className="space-y-1.5 flex-1">
              <h5 className={`text-sm font-semibold text-emerald-800 tracking-tight`}>
                Carbon Story: The Healing Forest
              </h5>
              <p className={`text-xs md:text-sm font-serif leading-relaxed ${isTwilightMode ? "text-slate-350" : "text-[#2D2A26]"}`}>
                Over the next <strong>{timelineYears} years</strong>, choosing a <strong>-{effortReductionPct}% Carbon</strong> pathway avoids carbon equivalent to the amount absorbed by <strong className="text-emerald-700">{Math.round(equivalentTreeSequestrationYears)} mature trees</strong> fully breathing for a complete season! This action effectively preserves high-altitude oxygen layers and lets fauna return.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

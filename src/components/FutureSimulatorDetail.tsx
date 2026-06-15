import { useState } from "react";
import { motion } from "motion/react";
import { TrendingDown, Sliders, Calendar, ChevronRight, DollarSign, Leaf, Sparkles, CloudRain, ShieldAlert, ArrowRight, ShieldCheck, Heart, Moon } from "lucide-react";

interface FutureSimulatorDetailProps {
  currentCO2: number;
  isTwilightMode: boolean;
}

export default function FutureSimulatorDetail({
  currentCO2,
  isTwilightMode,
}: FutureSimulatorDetailProps) {
  const [timelineYears, setTimelineYears] = useState<number>(10);
  const [effortReductionPct, setEffortReductionPct] = useState<number>(45);

  // Math constants for Future A (Standard path continues)
  const baselineAnnual = currentCO2;
  const baselineTotal = baselineAnnual * timelineYears;
  const tempRiseA = (baselineAnnual * 0.04) * (timelineYears / 10); // arbitrary fun predictive stats

  // Math constants for Future B (Sustainable recommended path)
  const improvedAnnual = Math.max(1.8, currentCO2 * (1 - effortReductionPct / 100));
  const improvedTotal = improvedAnnual * timelineYears;
  const carbonPrevented = Math.max(0, baselineTotal - improvedTotal);
  const tempRiseB = (improvedAnnual * 0.04) * (timelineYears / 10);
  const moneySaved = carbonPrevented * 320; // $320 savings constant
  const matureTreesProtected = Math.round(carbonPrevented * 45);

  return (
    <div
      id="future-simulator-detail-box"
      className={`p-6 rounded-2xl border transition-all duration-500 space-y-6 ${
        isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
      }`}
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/40 pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-widest block text-indigo-500">
            ✦ Immersive Planetary Foresight ✦
          </span>
          <h4 className={`font-bold tracking-tight text-xl flex items-center gap-1.5 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <TrendingDown className="w-5.5 h-5.5 text-indigo-500 animate-pulse" /> EchoEarth AI Carbon Time Machine
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Project two parallel multi-annual timelines into the future. Compare the permanent footprints of active transition.
          </p>
        </div>

        {/* Timelines selection */}
        <div className={`flex p-0.5 rounded-lg text-xs ${
          isTwilightMode ? "bg-slate-900" : "bg-stone-200"
        }`}>
          {[5, 10, 25, 50].map((yr) => (
            <button
              key={`${yr}-years`}
              id={`btn-time-machine-${yr}`}
              onClick={() => setTimelineYears(yr)}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                timelineYears === yr
                  ? isTwilightMode
                    ? "bg-[#1E2733] text-amber-300 shadow-sm border border-[#2B3545]"
                    : "bg-white text-emerald-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-800"
              }`}
            >
              {yr} Years
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Interactive Panel */}
        <div className="md:col-span-4 space-y-5">
          <div className="space-y-2">
            <h5 className={`text-xs uppercase font-extrabold tracking-widest ${
              isTwilightMode ? "text-slate-400" : "text-stone-500"
            }`}>
              Interactive Model Drivers
            </h5>
            <p className="text-xs font-serif leading-relaxed text-slate-400">
              Increase the rate at which you pledge alternate, sustainable transportation, organic habits, energy-saving configurations, and zero-waste systems to drive Future B.
            </p>
          </div>

          {/* Effort Range Slider */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isTwilightMode ? "bg-[#0E131E] border-[#1E252D]" : "bg-white border-stone-200"
          }`}>
            <div className="flex justify-between text-xs font-bold font-serif text-slate-400">
              <span>Goal Change Intensity</span>
              <span className="text-emerald-500 font-mono font-bold">-{effortReductionPct}% Carbon</span>
            </div>

            <input
              id="effortRange"
              type="range"
              min="10"
              max="90"
              step="5"
              value={effortReductionPct}
              onChange={(e) => setEffortReductionPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-450 uppercase font-extrabold font-mono">
              <span>Minor Adjustments (10%)</span>
              <span>Dedicated (45%)</span>
              <span>Radical Champion (90%)</span>
            </div>
          </div>

          {/* Key Quote Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-emerald-950/20 border border-indigo-500/20 text-center space-y-1.5 relative overflow-hidden">
            <Sparkles className="w-5 h-5 mx-auto text-yellow-300 animate-bounce" />
            <p className="text-sm font-serif italic text-indigo-200">
              &ldquo;The difference begins with your next decision.&rdquo;
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFFBEB]/40 block">
              — Your EchoEarth Prophecy
            </span>
          </div>
        </div>

        {/* Right Timelines Comparison Screen */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FUTURE A: Status Quo Path */}
            <motion.div
              layout
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                isTwilightMode ? "bg-[#171212] border-red-900/30" : "bg-red-50/40 border-red-200"
              }`}
            >
              {/* Polluted skyline mini svg */}
              <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
                <svg width="120" height="80" viewBox="0 0 120 80">
                  <path d="M0 60 Q20 40 40 55 T80 50 T120 60 L120 80 L0 80 Z" fill="#7F1D1D" />
                  <path d="M20 30 Q35 15 50 30" stroke="#EF4444" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-550 text-red-650 block mb-1">
                ⚠️ Future A: Status Quo
              </span>
              <h5 className={`font-bold text-lg tracking-tight ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
                Unchanged Trajectory
              </h5>
              <p className="text-xs text-slate-400 mb-4 font-serif">
                If your baseline carbon practices continue over the target timeline:
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 border-b border-rose-200/20 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Release</span>
                    <span className="text-xl font-mono font-bold text-red-500">{baselineAnnual.toFixed(1)}t CO₂</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cumulative Total</span>
                    <span className="text-xl font-mono font-bold text-red-500">{baselineTotal.toFixed(1)}t CO₂</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">💨 Atmosphere Quality:</span>
                    <span className="font-bold text-red-500">Acid Haze / Smog</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">🌸 Biodiversity Index:</span>
                    <span className="font-bold text-slate-400">Diminishing / -{effortReductionPct}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FUTURE B: Eco-Elected Path */}
            <motion.div
              layout
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                isTwilightMode ? "bg-[#101915] border-emerald-900/30" : "bg-emerald-50/40 border-emerald-250 border-emerald-300"
              }`}
            >
              {/* Lush garden mini svg canopy */}
              <div className="absolute top-0 right-0 opacity-25 pointer-events-none">
                <svg width="120" height="80" viewBox="0 0 120 80">
                  <circle cx="90" cy="30" r="16" fill="#10B981" />
                  <circle cx="102" cy="38" r="14" fill="#047857" />
                  <circle cy="80" cx="100" r="40" fill="#064E3B" />
                </svg>
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block mb-1">
                🌿 Future B: Ecoreformed Path
              </span>
              <h5 className={`font-bold text-lg tracking-tight ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
                Mitigated Trajectory
              </h5>
              <p className="text-xs text-slate-400 mb-4 font-serif">
                If you choose to adopt the recommended lifestyle modifications:
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 border-b border-emerald-205/20 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Release</span>
                    <span className="text-xl font-mono font-bold text-emerald-500">{improvedAnnual.toFixed(1)}t CO₂</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cumulative Total</span>
                    <span className="text-xl font-mono font-bold text-emerald-500">{improvedTotal.toFixed(1)}t CO₂</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">✨ Atmosphere Quality:</span>
                    <span className="font-bold text-emerald-500">Lush & Pristine</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">🌸 Biodiversity Index:</span>
                    <span className="font-bold text-emerald-600">Thriving / Flourishing</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Symmetrical Net Comparison Details */}
          <div className={`p-5 rounded-2xl border ${
            isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
          } space-y-4`}>
            <h6 className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F51B5] flex items-center gap-1">
              ✦ Net Prevented Overhead Impact (Future B vs A)
            </h6>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none">Net Carbon Blocked</span>
                <span className="text-2xl font-mono font-bold text-emerald-600">-{carbonPrevented.toFixed(1)} tons</span>
                <span className="text-[10px] text-slate-400 block">Less CO₂ trapped in sky</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none">Pledged Financial Saving</span>
                <span className="text-2xl font-mono font-bold text-indigo-505 text-indigo-500 flex items-center">
                  <DollarSign className="w-5 h-5 text-indigo-500" />
                  {Math.round(moneySaved).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">Utility rates kept at hand</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none">Forest Equivalencies</span>
                <span className="text-2xl font-mono font-bold text-amber-500 block">
                  🌲 {matureTreesProtected} Trees
                </span>
                <span className="text-[10px] text-slate-400 block">Safeguarded mature canopies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

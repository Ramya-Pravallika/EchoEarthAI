import { Sun, Moon, RotateCcw, Sparkles } from "lucide-react";

interface AppHeaderProps {
  isTwilightMode: boolean;
  setIsTwilightMode: (twilight: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (motion: boolean) => void;
  largeText: boolean;
  setLargeText: (large: boolean) => void;
  hasCompletedAssessment: boolean;
  setShowHeroAnimation: (show: boolean) => void;
  handleReset: () => void;
}

export default function AppHeader({
  isTwilightMode,
  setIsTwilightMode,
  reducedMotion,
  setReducedMotion,
  largeText,
  setLargeText,
  hasCompletedAssessment,
  setShowHeroAnimation,
  handleReset,
}: AppHeaderProps) {
  const headerThemeClass = isTwilightMode
    ? "bg-[#12181F]/95 border-b border-[#232A31]"
    : "bg-[#FCFAF6]/95 border-b border-[#E4E2DB]";

  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  return (
    <header
      id="app-navigation"
      className={`sticky top-0 z-50 transition-colors duration-500 backdrop-blur-md ${headerThemeClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold tracking-tight text-xl shadow-sm transition-all ${
              isTwilightMode
                ? "bg-amber-400 text-slate-950"
                : "bg-emerald-800 text-stone-100"
            }`}
          >
            {isTwilightMode ? "✦" : "🍃"}
          </div>
          <div>
            <h1 className={`text-xl font-extrabold tracking-tight flex items-center gap-1.5 ${titleTextClass}`}>
              EchoEarth AI
            </h1>
            <span className={`text-[10px] font-semibold tracking-widest uppercase block ${mutedTextClass}`}>
              Every Choice Leaves a Reflection
            </span>
          </div>
        </div>

        {/* Configuration and Special Immersive Dark Simulator Toggle */}
        <div id="controls-panel" className="flex flex-wrap items-center gap-3">
          <div
            id="theme-visual-selector"
            className={`flex items-center p-1 rounded-xl border transition-all ${
              isTwilightMode
                ? "bg-[#1A222B] border-[#2E3B4E]"
                : "bg-[#EFECE6] border-[#DAD6CD]"
            }`}
          >
            <button
              id="btn-toggle-natural"
              onClick={() => setIsTwilightMode(false)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                !isTwilightMode
                  ? "bg-[#FCFAF6] text-emerald-900 shadow-sm border border-[#E4E2DB]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" /> Natural Earth
            </button>

            <button
              id="btn-toggle-twilight"
              onClick={() => setIsTwilightMode(true)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isTwilightMode
                  ? "bg-[#12181F] text-amber-300 shadow-sm border border-[#232A31]"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Elegant Dark Simulation
            </button>
          </div>

          {/* General Utilities & Resets */}
          <div id="accessory-utilities" className="flex items-center gap-2">
            <button
              id="btn-toggle-motion"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-2 text-xs rounded-lg border font-bold transition-all cursor-pointer ${
                reducedMotion
                  ? "bg-stone-800 text-white"
                  : isTwilightMode
                  ? "border-[#232A31] text-slate-350 hover:bg-[#1A222B]"
                  : "border-[#E4E2DB] text-stone-600 hover:bg-[#EFECE6]"
              }`}
              title="Toggle Reduced Motion"
            >
              {reducedMotion ? "Motion Off" : "Motion"}
            </button>

            <button
              id="btn-toggle-text-size"
              onClick={() => setLargeText(!largeText)}
              className={`px-3 py-2 text-xs rounded-lg border font-bold transition-all cursor-pointer ${
                largeText
                  ? "bg-stone-800 text-white"
                  : isTwilightMode
                  ? "border-[#232A31] text-slate-350 hover:bg-[#1A222B]"
                  : "border-[#E4E2DB] text-stone-600 hover:bg-[#EFECE6]"
              }`}
              title="Toggle Large Font Size"
            >
              A+
            </button>

            {hasCompletedAssessment && (
              <>
                <button
                  id="btn-trigger-prophecy"
                  onClick={() => setShowHeroAnimation(true)}
                  className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50/50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Watch Prophecy Story
                </button>
                <button
                  id="btn-reset-assessment"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50/50 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Mirroring
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

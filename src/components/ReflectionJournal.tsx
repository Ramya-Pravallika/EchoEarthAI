import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Award, Compass, Sparkles, Send, Check } from "lucide-react";

interface ReflectionJournalProps {
  identityTitle: string;
  isTwilightMode: boolean;
  onRewardPoints: (pts: number, actionLog: string) => void;
}

interface SavedJournalEntry {
  date: string;
  entry: string;
  vitalityMood: string;
  microTip: string;
  analysis: string;
}

export default function ReflectionJournal({
  identityTitle,
  isTwilightMode,
  onRewardPoints,
}: ReflectionJournalProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedEntries, setSavedEntries] = useState<SavedJournalEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    analysis: string;
    vitalityMood: string;
    microTip: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("echoearth_journal_entries");
    if (saved) {
      try {
        setSavedEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal history", e);
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setCurrentAnalysis(null);

    try {
      const res = await fetch("/api/journal-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: inputText, identityTitle }),
      });

      if (res.ok) {
        const json = await res.json();
        setCurrentAnalysis(json);

        const newEntry: SavedJournalEntry = {
          date: new Date().toLocaleDateString(),
          entry: inputText,
          vitalityMood: json.vitalityMood || "Thoughtful",
          microTip: json.microTip || "Breathe clean atmosphere today.",
          analysis: json.analysis || "Thank you for reflecting on your carbon footprint journey today.",
        };

        const updated = [newEntry, ...savedEntries].slice(0, 10);
        setSavedEntries(updated);
        localStorage.setItem("echoearth_journal_entries", JSON.stringify(updated));

        // Reward points to the user for reflection journal
        onRewardPoints(25, "Completed AI Sustainability Reflection Journal");
        setInputText("");
      }
    } catch (e) {
      console.error("Journal analysis failed", e);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const m = mood.toLowerCase();
    if (m.includes("hope")) return "🌱";
    if (m.includes("energ") || m.includes("activ")) return "⚡";
    if (m.includes("reflect") || m.includes("thought")) return "🧘";
    if (m.includes("motiv")) return "💫";
    return "🍃";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="reflection-journal-overall bg-slate">
      {/* Journal Entry Column */}
      <div
        id="journal-entry-card"
        className={`p-6 rounded-2xl border transition-all duration-500 space-y-4 ${
          isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <div id="journal-headline" className="space-y-1">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block border ${
            isTwilightMode ? "bg-cyan-500/15 border-cyan-500/20 text-cyan-300" : "bg-emerald-50 border-emerald-100/60 text-emerald-800"
          }`}>
            🌿 Emotional Awareness Practice 🌿
          </span>
          <h4 className={`font-bold tracking-tight text-lg flex items-center gap-1.5 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <BookOpen className="w-5 h-5 text-indigo-500" /> Sustainability Journal
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Emotions drive changes. Scribe your feelings about your lifestyle decisions.
          </p>
        </div>

        <div className="space-y-3">
          <label htmlFor="journal-prompt-area" className={`block text-xs font-bold uppercase ${
            isTwilightMode ? "text-slate-300" : "text-stone-700"
          }`}>
            What sustainable action (no matter how small) made you happiest today?
          </label>
          <textarea
            id="journal-prompt-area"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write about walking instead of driving, enjoying a vegetable dinner, composting food, or reflecting on carbon savings..."
            className={`w-full p-3.5 rounded-xl border text-sm font-serif leading-relaxed focus:outline-none focus:ring-1 transition-all ${
              isTwilightMode
                ? "bg-[#161D26] border-[#222E3C] focus:ring-indigo-500 text-stone-100"
                : "bg-white border-[#E4E2DB] focus:ring-emerald-700 text-stone-900"
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs flex items-center gap-1 text-emerald-600 font-semibold`}>
            <Award className="w-3.5 h-3.5 animate-pulse" /> +25 Vitality Reward
          </span>

          <button
            id="btn-submit-reflection"
            disabled={!inputText.trim() || loading}
            onClick={handleAnalyze}
            className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-stone-100 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <>Analyzing reflection...</>
            ) : (
              <>
                Scribe & Analyze <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Current Scribed Analysis feedback element */}
        <AnimatePresence>
          {currentAnalysis && (
            <motion.div
              id="analysis-display-panel"
              initial={{ opacity: 0, scale: 0.98, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              className={`p-4 rounded-xl border space-y-3.5 relative overflow-hidden mt-4 ${
                isTwilightMode ? "bg-[#182330] border-indigo-500/30 text-slate-200" : "bg-indigo-50/50 border-indigo-200/60 text-stone-900"
              }`}
            >
              <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">
                  EchoEarth AI Insight Summary
                </span>
                <span className="text-xs font-bold leading-none flex items-center gap-1 bg-white/40 px-2 py-1 rounded">
                  {getMoodEmoji(currentAnalysis.vitalityMood)} Mood: {currentAnalysis.vitalityMood}
                </span>
              </div>

              <p className="text-xs font-serif leading-relaxed italic">
                &ldquo;{currentAnalysis.analysis}&rdquo;
              </p>

              <div className={`p-3 rounded-lg flex items-start gap-2 text-xs border bg-white/70 ${
                isTwilightMode ? "border-[#222E3C] text-stone-900" : "border-indigo-100 text-indigo-950"
              }`}>
                <Compass className="w-4 h-4 text-indigo-650 text-indigo-600 shrink-0 mt-0.5 animate-bounce-slow" />
                <div>
                  <strong className="block text-[10px] uppercase font-bold text-slate-500">Tomorrow's Micro-Tip</strong>
                  <span>{currentAnalysis.microTip}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Journal History Logs Column */}
      <div
        id="journal-history-card"
        className={`p-6 rounded-2xl border transition-all duration-500 space-y-4 flex flex-col ${
          isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <div id="journal-history-headline">
          <h4 className={`font-bold tracking-tight text-base ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            Reflection Logs ({savedEntries.length})
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Scribing habit progress maintains mental connection & streak rates.
          </p>
        </div>

        {savedEntries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-stone-300/40 rounded-xl">
            <BookOpen className="w-8 h-8 text-stone-400/60 mb-2" />
            <p className="text-xs text-stone-400 font-serif">
              No entries saved in the history mirror. Complete your first reflection audit today!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[340px] space-y-3 pr-1">
            {savedEntries.map((ent, idx) => (
              <div
                key={`journal-${idx}`}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-colors ${
                  isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold ${isTwilightMode ? "text-slate-450 text-slate-400" : "text-stone-500"}`}>
                    {ent.date}
                  </span>
                  <span className="font-bold flex items-center gap-0.5 text-indigo-500">
                    {getMoodEmoji(ent.vitalityMood)} {ent.vitalityMood}
                  </span>
                </div>
                <p className={`font-serif ${isTwilightMode ? "text-slate-350 text-slate-300" : "text-stone-800"}`}>
                  {ent.entry}
                </p>
                <div className="pt-2 border-t border-dashed border-stone-200/40 flex items-start gap-1 text-emerald-600">
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="italic">{ent.microTip}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

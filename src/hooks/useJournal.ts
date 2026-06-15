import { useState, useEffect, useCallback } from "react";

export interface SavedJournalEntry {
  date: string;
  entry: string;
  vitalityMood: string;
  microTip: string;
  analysis: string;
}

interface UseJournalProps {
  identityTitle: string;
  onRewardPoints: (pts: number, actionLog: string) => void;
}

export function useJournal({ identityTitle, onRewardPoints }: UseJournalProps) {
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
        console.error("Failed to parse journal history from localStorage persistence", e);
      }
    }
  }, []);

  const analyzeAndPostEntry = useCallback(async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;
    setLoading(true);
    setCurrentAnalysis(null);

    try {
      const res = await fetch("/api/journal-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: trimmedInput, identityTitle }),
      });

      if (res.ok) {
        const json = await res.json();
        setCurrentAnalysis(json);

        const newEntry: SavedJournalEntry = {
          date: new Date().toLocaleDateString(),
          entry: trimmedInput,
          vitalityMood: json.vitalityMood || "Thoughtful",
          microTip: json.microTip || "Breathe clean atmosphere today.",
          analysis: json.analysis || "Thank you for reflecting on your carbon footprint journey today.",
        };

        setSavedEntries((prev) => {
          const updated = [newEntry, ...prev].slice(0, 10);
          localStorage.setItem("echoearth_journal_entries", JSON.stringify(updated));
          return updated;
        });

        // Reward points to the user for reflection journal
        onRewardPoints(25, "Completed AI Sustainability Reflection Journal");
        setInputText("");
      }
    } catch (e) {
      console.error("Journal analysis pipeline error:", e);
    } finally {
      setLoading(false);
    }
  }, [inputText, identityTitle, onRewardPoints]);

  return {
    inputText,
    setInputText,
    loading,
    savedEntries,
    currentAnalysis,
    analyzeAndPostEntry,
  };
}
export default useJournal;

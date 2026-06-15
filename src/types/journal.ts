export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  vitalityMood: string;
  analysisHint: string;
  microTip: string;
}

export interface JournalState {
  entries: JournalEntry[];
  isSaving: boolean;
}

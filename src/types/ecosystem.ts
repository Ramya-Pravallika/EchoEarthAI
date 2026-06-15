import { AssessmentAnswers, CarbonReflection } from "./assessment";

export interface UserSessionState {
  hasCompletedAssessment: boolean;
  answers: AssessmentAnswers | null;
  reflection: CarbonReflection | null;
  adoptedInterventions: string[]; // ids of adopted interventions
  completedMissions: string[]; // ids of completed daily missions
  ecosystemPoints: number; // gamified positive points
  historyLog: { date: string; action: string; co2Impact: number }[];
}

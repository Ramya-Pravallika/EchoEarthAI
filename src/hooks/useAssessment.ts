import { useState, useCallback } from "react";
import { AssessmentAnswers, CarbonReflection, UserSessionState } from "../types/index";

interface UseAssessmentProps {
  session: UserSessionState;
  saveSession: (nextState: UserSessionState) => void;
  triggerNarrativeReport: (state: UserSessionState) => void;
  setShowHeroAnimation: (isOpen: boolean) => void;
}

export function useAssessment({
  session,
  saveSession,
  triggerNarrativeReport,
  setShowHeroAnimation,
}: UseAssessmentProps) {
  const [assessmentLoading, setAssessmentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAssessmentSubmit = useCallback(
    async (answers: AssessmentAnswers) => {
      setAssessmentLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch("/api/carbon-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        if (!response.ok) {
          throw new Error("Validation or model load failure");
        }

        const reflection: CarbonReflection = await response.json();

        const nextState: UserSessionState = {
          hasCompletedAssessment: true,
          answers,
          reflection,
          adoptedInterventions: [],
          completedMissions: [],
          ecosystemPoints: 50,
          historyLog: [
            {
              date: new Date().toLocaleDateString(),
              action: "Completed lifestyle assessment profile",
              co2Impact: 0,
            },
          ],
        };

        saveSession(nextState);
        triggerNarrativeReport(nextState);
        setShowHeroAnimation(true);
      } catch (err) {
        setErrorMessage("Encountered connection drop with model. Retrying assessment submission.");
      } finally {
        setAssessmentLoading(false);
      }
    },
    [saveSession, triggerNarrativeReport, setShowHeroAnimation]
  );

  return {
    assessmentLoading,
    errorMessage,
    setErrorMessage,
    handleAssessmentSubmit,
  };
}
export default useAssessment;

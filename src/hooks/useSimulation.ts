import { useState, useCallback } from "react";
import { UserSessionState } from "../types/index";
import {
  calculateSimulatedScore,
  calculateFuturisticSimulationScore,
  getEcosystemMood,
} from "../services/carbon/calculator";

/**
 * Custom hook to control Foresight Simulator visual states and calculators
 */
export function useSimulation(session: UserSessionState) {
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simulationPercent, setSimulationPercent] = useState<number>(50);

  const getSimulatedScoreValue = useCallback(() => {
    return calculateSimulatedScore(session);
  }, [session]);

  const getFuturisticSimulationScoreValue = useCallback(() => {
    return calculateFuturisticSimulationScore(session, simulationPercent);
  }, [session, simulationPercent]);

  const getTargetEcosystemMoodText = useCallback(() => {
    const score = getSimulatedScoreValue();
    return getEcosystemMood(score);
  }, [getSimulatedScoreValue]);

  return {
    isSimulationMode,
    setIsSimulationMode,
    simulationPercent,
    setSimulationPercent,
    getSimulatedScore: getSimulatedScoreValue,
    getFuturisticSimulationScore: getFuturisticSimulationScoreValue,
    getTargetEcosystemMood: getTargetEcosystemMoodText,
  };
}
export default useSimulation;

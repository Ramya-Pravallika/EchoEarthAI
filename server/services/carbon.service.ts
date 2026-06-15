import { getProgrammaticAssessment } from "../../src/services/carbon/calculator";

export function evaluateCarbonAnswers(answers: any) {
  return getProgrammaticAssessment(answers);
}

export function getCarbonBenchmark() {
  return 16.0;
}

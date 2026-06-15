import { getStandardScoringBenchmark } from "../../src/services/carbon/scoring";

describe("Scoring Engine", () => {
  it("benchmark check", () => {
    expect(getStandardScoringBenchmark()).toBe(16.0);
  });
});

import { getDefaultInterventions } from "../../src/services/carbon/recommendation";

describe("Recommendation Engine", () => {
  it("returns default recommended actions", () => {
    const actions = getDefaultInterventions();
    expect(actions.length).toBeGreaterThan(0);
  });
});

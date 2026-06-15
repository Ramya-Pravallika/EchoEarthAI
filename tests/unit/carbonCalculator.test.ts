import { getProgrammaticAssessment } from "../../src/services/carbon/calculator";

describe("Carbon Calculator", () => {
  it("calculates realistic co2", () => {
    const result = getProgrammaticAssessment({
      transportation: { commuteMethod: "active", commuteMiles: 0, flightsLength: "none" },
      food: { dietType: "vegan", organicLocal: "mostly", foodWaste: "low" },
      energy: { homeSize: "apartment", heatingSource: "renewable", greenElectricity: true },
      shopping: { purchaseFrequency: "minimal", secondHand: "always" },
      waste: { recyclingLevel: "complete", composting: true, singleUsePlastics: "minimal" }
    });
    expect(result.estimatedTotalCO2).toBeLessThan(10);
  });
});

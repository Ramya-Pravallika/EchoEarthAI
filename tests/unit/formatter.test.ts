import { formatCarbonScore } from "../../src/utils/formatter";

describe("Formatter Engine", () => {
  it("formats carbon correctly", () => {
    expect(formatCarbonScore(12.3)).toContain("12.3");
  });
});

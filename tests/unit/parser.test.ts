describe("Response Parser", () => {
  it("should parse correctly", () => {
    expect(JSON.parse('{"status":"ok"}')).toEqual({status:"ok"});
  });
});

import { isMandateSuccessful } from "./monoComplete";

// react-router-dom v7 ships ESM-first and does not resolve under CRA's jest
// config; the module under test imports it for the page component, which
// these tests never render.
jest.mock(
  "react-router-dom",
  () => ({ useNavigate: () => jest.fn() }),
  { virtual: true }
);

describe("isMandateSuccessful", () => {
  it("accepts Mono's live redirect status (status=success)", () => {
    // Observed in production: ?reference=...&status=success&reason=mandate_success
    expect(isMandateSuccessful("success")).toBe(true);
  });

  it("accepts the documented spelling (status=successful)", () => {
    expect(isMandateSuccessful("successful")).toBe(true);
    expect(isMandateSuccessful('"Successful"')).toBe(true);
  });

  it("treats anything else as not authorised", () => {
    expect(isMandateSuccessful("failed")).toBe(false);
    expect(isMandateSuccessful("widget_closed")).toBe(false);
    expect(isMandateSuccessful("")).toBe(false);
    expect(isMandateSuccessful(undefined)).toBe(false);
    expect(isMandateSuccessful(null)).toBe(false);
  });
});

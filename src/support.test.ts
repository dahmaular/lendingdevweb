import { isPlaceholder, telHref, whatsappHref } from "./support";

describe("support contact links", () => {
  // Written either way, a number must dial the same place. The first version
  // assumed local format and turned +234 803… into tel:+234234803….
  it.each(["08031234567", "0803 123 4567", "+234 803 123 4567", "2348031234567"])(
    "normalises %s",
    (phone) => {
      expect(telHref(phone)).toBe("tel:+2348031234567");
      expect(whatsappHref(phone)).toBe("https://wa.me/2348031234567");
    }
  );

  it("recognises an unfilled [placeholder]", () => {
    expect(isPlaceholder("[support email]")).toBe(true);
    expect(isPlaceholder("info@devtagefs.com")).toBe(false);
  });
});

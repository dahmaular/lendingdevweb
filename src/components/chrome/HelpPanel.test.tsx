import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelpLink } from "./HelpPanel";
import { SUPPORT, isPlaceholder } from "../../support";

/** jsdom has no matchMedia; reduced motion keeps the panel's transitions short. */
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: /prefers-reduced-motion/.test(query),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const openPanel = () => {
  render(<HelpLink />);
  fireEvent.click(screen.getByRole("button", { name: /need help/i }));
  return screen.getByRole("dialog", { name: /how can we help/i });
};

describe("Help panel", () => {
  it("opens from the Need help? link with the questions and a way to reach us", () => {
    const dialog = openPanel();
    expect(dialog).toHaveTextContent("Will checking my eligibility affect my credit score?");
    expect(dialog).toHaveTextContent("Still stuck? Talk to us");
  });

  it("moves focus into the panel, and closes on Escape", async () => {
    openPanel();
    expect(screen.getByRole("button", { name: /close help/i })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("never turns an unfilled [placeholder] into a tappable link", () => {
    const dialog = openPanel();
    const hrefs = Array.from(dialog.querySelectorAll("a")).map((a) => a.getAttribute("href") || "");

    // Only the resume link should be present while the contact details are
    // still placeholders — no mailto:[support email], no tel:+234.
    if (isPlaceholder(SUPPORT.email)) {
      expect(hrefs.some((h) => h.startsWith("mailto:"))).toBe(false);
    }
    if (isPlaceholder(SUPPORT.phone)) {
      expect(hrefs.some((h) => h.startsWith("tel:") || h.includes("wa.me"))).toBe(false);
    }
    expect(hrefs).toContain("/apply?resume=1");
  });
});

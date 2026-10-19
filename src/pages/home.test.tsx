import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./home";

// react-router-dom v7 ships ESM-first and does not resolve under CRA's jest
// config. The page only needs useNavigate, so it is mocked virtually rather
// than dragging the router into a test about visibility.
jest.mock(
  "react-router-dom",
  () => ({ useNavigate: () => jest.fn() }),
  { virtual: true }
);

/**
 * The landing page hides its copy behind entrance animations. The failure mode
 * that matters is content that never becomes visible because the animation did
 * not run — which is exactly what `prefers-reduced-motion` asks for.
 *
 * jsdom has no matchMedia, so it is stubbed per test.
 */
const mockMatchMedia = (reduced: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: /prefers-reduced-motion/.test(query) ? reduced : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

const renderHome = () => render(<Home />);

/** framer-motion writes its values inline, so this is what the viewer sees. */
const inlineOpacity = (el: HTMLElement | null): string =>
  el?.style.opacity ?? "";

describe("Home, with reduced motion requested", () => {
  beforeEach(() => mockMatchMedia(true));

  it("renders the hero headline visibly", () => {
    renderHome();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Financial Freedom Starts Here/);
    heading.querySelectorAll("span").forEach((span) => {
      expect(inlineOpacity(span as HTMLElement)).not.toBe("0");
    });
  });

  it("leaves no section copy stuck at zero opacity", () => {
    const { container } = renderHome();
    const animated = container.querySelectorAll<HTMLElement>("p, article, li");
    expect(animated.length).toBeGreaterThan(0);
    animated.forEach((el) => {
      expect(inlineOpacity(el)).not.toBe("0");
    });
  });

  it("does not collapse the step rules", () => {
    // The How it works rules draw with scaleX. If the reduced-motion branch
    // ever attached those variants, every rule would sit at scaleX(0) and the
    // section would render with no rules at all — invisible, not just static.
    const { container } = renderHome();
    container.querySelectorAll<HTMLElement>("span").forEach((el) => {
      expect(el.style.transform ?? "").not.toMatch(/scale(X)?\(0\b/);
      expect(el.style.opacity).not.toBe("0");
    });
  });

  it("still offers every slide's copy and its control", () => {
    renderHome();
    expect(screen.getByText(/Get approved in minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Funds in 24 hours/)).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });
});

describe("Home, with motion allowed", () => {
  beforeEach(() => mockMatchMedia(false));

  it("still puts the headline in the document for anything that does not animate", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent(/Financial Freedom Starts Here/);
  });
});

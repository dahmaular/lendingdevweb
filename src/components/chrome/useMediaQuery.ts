import { useEffect, useState } from "react";

/**
 * Inline styles can't carry media queries, and this codebase styles everything
 * with inline objects. So the breakpoints live here instead.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Below this the running receipt stops being a column and folds up. */
export const useIsCompact = () => useMediaQuery("(max-width: 1023px)");

/** Below this the step ribbon drops its per-step labels. */
export const useIsNarrow = () => useMediaQuery("(max-width: 767px)");

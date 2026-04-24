import { useEffect, useRef } from "react";

/**
 * After appending a row/sample, call `mark(nextIndex)` immediately before the
 * state update. On commit, scrolls `[data-obs-entry="${entryPrefix}-${index}"]`
 * into view.
 */
export function useScrollToNewEntry(rowCount, entryPrefix) {
  const pendingIdx = useRef(null);

  useEffect(() => {
    if (pendingIdx.current === null) return;
    const idx = pendingIdx.current;
    pendingIdx.current = null;
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-obs-entry="${entryPrefix}-${idx}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [rowCount, entryPrefix]);

  return (rowIndexToReveal) => {
    pendingIdx.current = rowIndexToReveal;
  };
}

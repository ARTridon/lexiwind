import { useCallback, useRef, useState } from "react";

export interface FloatingPosition {
  top: number;
  left: number;
}

export interface UseFloatingPositionResult {
  position: FloatingPosition | null;
  updatePosition: () => void;
  clearPosition: () => void;
  floatingRef: React.RefObject<HTMLDivElement>;
}

export function useFloatingPosition(): UseFloatingPositionResult {
  const floatingRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  const updatePosition = useCallback(() => {
    const nativeSel = window.getSelection();
    if (!nativeSel || nativeSel.rangeCount === 0) {
      setPosition(null);
      return;
    }
    const range = nativeSel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0) {
      setPosition(null);
      return;
    }
    const floatingEl = floatingRef.current;
    const floatingWidth = floatingEl ? floatingEl.offsetWidth : 240;
    const floatingHeight = floatingEl ? floatingEl.offsetHeight : 40;
    const top = rect.top + window.scrollY - floatingHeight - 8;
    const centeredLeft =
      rect.left + window.scrollX + rect.width / 2 - floatingWidth / 2;
    const clampedLeft = Math.max(
      8,
      Math.min(centeredLeft, window.innerWidth - floatingWidth - 8)
    );
    setPosition({ top, left: clampedLeft });
  }, []);

  const clearPosition = useCallback(() => setPosition(null), []);

  return { position, updatePosition, clearPosition, floatingRef };
}

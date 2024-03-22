import { useCallback, useMemo, useRef } from "react";
import type { SlashCommandEntry } from "@lexiwind/core";
import { useSlashCommandRegistry } from "./useSlashCommandRegistry";

export function useRegisterSlashCommands(
  entries: SlashCommandEntry[],
  deps: unknown[] = []
) {
  const { register } = useSlashCommandRegistry();

  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  const stableDeps = useMemo(() => deps, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return useCallback(() => {
    const cleanups = entriesRef.current.map(register);
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, stableDeps]);
}

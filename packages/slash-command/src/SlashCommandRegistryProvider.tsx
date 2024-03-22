"use client";

import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SlashCommandEntry, Unsubscribe } from "@lexiwind/core";
import type { SlashCommandRegistryAPI } from "./SlashCommandRegistry";
import { SlashCommandRegistryContext } from "./SlashCommandRegistryContext";

interface SlashCommandRegistryProviderProps {
  children: ReactNode;
  initial?: SlashCommandEntry[];
}

export function SlashCommandRegistryProvider({
  children,
  initial = [],
}: SlashCommandRegistryProviderProps) {
  const [commands, setCommands] = useState<SlashCommandEntry[]>(initial);

  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  const register = useCallback((entry: SlashCommandEntry): Unsubscribe => {
    setCommands((prev) => {
      if (prev.some((c) => c.id === entry.id)) return prev;
      return [...prev, entry];
    });
    return () =>
      setCommands((prev) => prev.filter((c) => c.id !== entry.id));
  }, []);

  const unregister = useCallback((id: string) => {
    setCommands((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo<SlashCommandRegistryAPI>(
    () => ({ commands, register, unregister }),
    [commands, register, unregister]
  );

  return (
    <SlashCommandRegistryContext.Provider value={value}>
      {children}
    </SlashCommandRegistryContext.Provider>
  );
}

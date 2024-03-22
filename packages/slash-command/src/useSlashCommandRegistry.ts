import { useContext } from "react";
import { SlashCommandRegistryContext } from "./SlashCommandRegistryContext";
import type { SlashCommandRegistryAPI } from "./SlashCommandRegistry";

export function useSlashCommandRegistry(): SlashCommandRegistryAPI {
  const ctx = useContext(SlashCommandRegistryContext);
  if (!ctx)
    throw new Error(
      "useSlashCommandRegistry must be used inside <SlashCommandRegistryProvider>"
    );
  return ctx;
}

import { createContext } from "react";
import type { SlashCommandRegistryAPI } from "./SlashCommandRegistry";

export const SlashCommandRegistryContext =
  createContext<SlashCommandRegistryAPI | null>(null);

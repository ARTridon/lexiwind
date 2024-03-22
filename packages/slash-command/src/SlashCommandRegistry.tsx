import type { SlashCommandEntry, Unsubscribe } from "@lexiwind/core";

export interface SlashCommandRegistryAPI {
  commands: SlashCommandEntry[];
  register(entry: SlashCommandEntry): Unsubscribe;
  unregister(id: string): void;
}

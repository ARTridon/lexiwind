"use client";

import { HistoryPlugin as LexicalHistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import type { HistoryState } from "@lexical/history";

export type { HistoryState };

export interface HistoryPluginProps {
  /** Share a HistoryState instance to synchronize history across multiple editors. */
  externalHistoryState?: HistoryState;
}

export function HistoryPlugin({ externalHistoryState }: HistoryPluginProps) {
  return <LexicalHistoryPlugin externalHistoryState={externalHistoryState} />;
}

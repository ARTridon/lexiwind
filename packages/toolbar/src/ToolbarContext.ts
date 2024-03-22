import { createContext } from "react";
import type {
  FormatState,
  BlockTypeState,
  HistoryState,
  AlignmentState,
  LinkState,
  TableState,
  FontStyleState,
  CodeState,
} from "./index";

export type ToolbarContextType = FormatState &
  BlockTypeState &
  HistoryState &
  AlignmentState &
  LinkState &
  TableState &
  FontStyleState &
  CodeState;

export const ToolbarContext = createContext<ToolbarContextType | null>(null);

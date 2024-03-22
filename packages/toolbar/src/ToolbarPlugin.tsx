"use client";

import { type ReactNode } from "react";
import {
  useFormatState,
  useBlockType,
  useHistory,
  useAlignment,
  useLinkState,
  useTableState,
  useFontStyle,
  useCodeState,
} from "./index";
import { ToolbarContext, type ToolbarContextType } from "./ToolbarContext";

export function ToolbarPlugin({ children }: { children: ReactNode }) {
  const format = useFormatState();
  const block = useBlockType();
  const history = useHistory();
  const alignment = useAlignment();
  const link = useLinkState();
  const table = useTableState();
  const font = useFontStyle();
  const code = useCodeState();

  const value: ToolbarContextType = {
    ...format,
    ...block,
    ...history,
    ...alignment,
    ...link,
    ...table,
    ...font,
    ...code,
  };

  return (
    <ToolbarContext.Provider value={value}>
      {children}
    </ToolbarContext.Provider>
  );
}

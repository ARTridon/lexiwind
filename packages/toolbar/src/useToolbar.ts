import { useContext } from "react";
import { ToolbarContext, type ToolbarContextType } from "./ToolbarContext";

export function useToolbar(): ToolbarContextType {
  const ctx = useContext(ToolbarContext);
  if (!ctx) throw new Error("useToolbar must be used inside <ToolbarPlugin>");
  return ctx;
}

import { ToolbarContext, ToolbarContextType } from "@/plugins/ToolbarPlugin";
import { useContext } from "react";

export const useToolbar = (): ToolbarContextType => useContext(ToolbarContext);

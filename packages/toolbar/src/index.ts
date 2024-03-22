// ─── Domain hooks (granular — import only what you need) ──────────────────────
export { useFormatState } from './hooks/useFormatState';
export type { FormatState } from './hooks/useFormatState';

export { useBlockType } from './hooks/useBlockType';
export type { BlockTypeState } from './hooks/useBlockType';

export { useHistory } from './hooks/useHistory';
export type { HistoryState } from './hooks/useHistory';

export { useAlignment } from './hooks/useAlignment';
export type { AlignmentState } from './hooks/useAlignment';

export { useLinkState } from './hooks/useLinkState';
export type { LinkState } from './hooks/useLinkState';

export { useTableState } from './hooks/useTableState';
export type { TableState } from './hooks/useTableState';

export { useFontStyle } from './hooks/useFontStyle';
export type { FontStyleState } from './hooks/useFontStyle';

export { useCodeState } from './hooks/useCodeState';
export type { CodeState } from './hooks/useCodeState';

// ─── Selection utility ────────────────────────────────────────────────────────
export { useCachedSelection } from './hooks/useCachedSelection';

// ─── Merged provider + consumer ───────────────────────────────────────────────
export { ToolbarPlugin } from "./ToolbarPlugin";
export { useToolbar } from "./useToolbar";
export { ToolbarContext } from "./ToolbarContext";
export type { ToolbarContextType } from "./ToolbarContext";

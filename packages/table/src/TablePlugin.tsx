"use client";

import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";

export interface TablePluginProps {
  /** Enable merged cells (colspan/rowspan). Default: true. */
  hasCellMerge?: boolean;
  /** Allow per-cell background colors. Default: true. */
  hasCellBackgroundColor?: boolean;
  /** Use Tab key to move between cells. Default: true. */
  hasTabHandler?: boolean;
  /** Wrap tables in a horizontally scrollable container. Default: false. */
  hasHorizontalScroll?: boolean;
}

export function TablePlugin({
  hasCellMerge = true,
  hasCellBackgroundColor = true,
  hasTabHandler = true,
  hasHorizontalScroll = false,
}: TablePluginProps = {}) {
  return (
    <LexicalTablePlugin
      hasCellMerge={hasCellMerge}
      hasCellBackgroundColor={hasCellBackgroundColor}
      hasTabHandler={hasTabHandler}
      hasHorizontalScroll={hasHorizontalScroll}
    />
  );
}

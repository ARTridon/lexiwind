import { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_TABLE_COMMAND,
  type InsertTableCommandPayloadHeaders,
} from "@lexical/table";

export interface InsertTableOptions {
  rows: number;
  columns: number;
  includeHeaders?: InsertTableCommandPayloadHeaders;
}

export interface UseTableResult {
  insertTable(options: InsertTableOptions): void;
}

/**
 * Dispatches INSERT_TABLE_COMMAND with stringified row/column counts.
 * Requires TablePlugin and the table nodes (TableNode, TableRowNode,
 * TableCellNode) registered in the same LexicalComposer tree.
 */
export function useTable(): UseTableResult {
  const [editor] = useLexicalComposerContext();

  const insertTable = useCallback(
    ({ rows, columns, includeHeaders }: InsertTableOptions) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: String(rows),
        columns: String(columns),
        includeHeaders,
      });
    },
    [editor]
  );

  return { insertTable };
}

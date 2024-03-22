export { TablePlugin } from "./TablePlugin";
export type { TablePluginProps } from "./TablePlugin";
export { useTable } from "./useTable";
export type { InsertTableOptions, UseTableResult } from "./useTable";
export {
  INSERT_TABLE_COMMAND,
  TableNode,
  TableRowNode,
  TableCellNode,
  TableCellHeaderStates,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
} from "@lexical/table";
export type {
  InsertTableCommandPayload,
  InsertTableCommandPayloadHeaders,
  SerializedTableNode,
  SerializedTableRowNode,
  SerializedTableCellNode,
} from "@lexical/table";

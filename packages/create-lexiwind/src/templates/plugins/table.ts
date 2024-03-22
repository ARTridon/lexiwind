import type { Framework } from '../../utils/detect';

export function generateTableToolbarTsx(opts: { framework: Framework }): string {
  const useClient = opts.framework === "nextjs-app";
  const directive = useClient ? '"use client";\n\n' : "";

  return `${directive}import { useContext } from "react";
import { ToolbarContext } from "lexiwind";

/**
 * Table-specific toolbar buttons — render these inside your <EditorToolbar />
 * when the cursor is inside a table cell (toolbar.isInTable === true).
 *
 * Example:
 *   {toolbar.isInTable && <TableToolbarButtons />}
 */
export function TableToolbarButtons() {
  const toolbar = useContext(ToolbarContext);

  if (!toolbar.isInTable) return null;

  return (
    <div className="flex items-center gap-0.5 border-t border-gray-100 bg-blue-50/60 px-2 py-1">
      <span className="mr-1.5 text-xs text-gray-500">Table:</span>

      <TableButton onClick={toolbar.insertTableRowBefore} title="Insert row above">
        ↑ Row
      </TableButton>
      <TableButton onClick={toolbar.insertTableRowAfter} title="Insert row below">
        ↓ Row
      </TableButton>
      <TableButton onClick={toolbar.insertTableColumnBefore} title="Insert column left">
        ← Col
      </TableButton>
      <TableButton onClick={toolbar.insertTableColumnAfter} title="Insert column right">
        → Col
      </TableButton>

      <div className="mx-1 h-4 w-px bg-gray-200" />

      <TableButton onClick={toolbar.deleteTableRow} title="Delete row" danger>
        ✕ Row
      </TableButton>
      <TableButton onClick={toolbar.deleteTableColumn} title="Delete column" danger>
        ✕ Col
      </TableButton>
    </div>
  );
}

function TableButton({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "rounded px-2 py-0.5 text-xs transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
`;
}

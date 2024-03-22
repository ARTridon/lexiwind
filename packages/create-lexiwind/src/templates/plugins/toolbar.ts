import type { Framework } from '../../utils/detect';

export type ToolbarTemplateOptions = {
  framework: Framework;
};

export function generateToolbarTsx(opts: ToolbarTemplateOptions): string {
  const useClient = opts.framework === "nextjs-app";

  const header = useClient ? '"use client";\n\n' : "";

  return (
    header +
    `import { useContext } from "react";
import { ToolbarContext } from "lexiwind";
import type { BlockType } from "lexiwind";

export function EditorToolbar() {
  const toolbar = useContext(ToolbarContext);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50/80 px-2 py-1.5">
      <ToolbarGroup>
        <ToolbarButton
          onClick={toolbar.undoHandler}
          disabled={!toolbar.canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={toolbar.redoHandler}
          disabled={!toolbar.canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↪
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <BlockTypeSelect
        value={toolbar.blockType}
        onChange={(type) => {
          if (type === "paragraph") toolbar.formatParagraph();
          else if (type === "h1" || type === "h2" || type === "h3") toolbar.formatHeading(type);
          else if (type === "bullet") toolbar.formatBulletList();
          else if (type === "number") toolbar.formatNumberedList();
          else if (type === "check") toolbar.formatCheckList();
          else if (type === "quote") toolbar.formatQuote();
          else if (type === "code") toolbar.formatCode();
        }}
      />

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton
          onClick={toolbar.boldHandler}
          active={toolbar.isBold}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={toolbar.italicHandler}
          active={toolbar.isItalic}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={toolbar.underlineHandler}
          active={toolbar.isUnderline}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={toolbar.strikethroughHandler}
          active={toolbar.isStrikethrough}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={toolbar.alignLeftHandler} title="Align left">
          &#8676;
        </ToolbarButton>
        <ToolbarButton onClick={toolbar.alignCenterHandler} title="Align center">
          &#8801;
        </ToolbarButton>
        <ToolbarButton onClick={toolbar.alignRightHandler} title="Align right">
          &#8677;
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={toolbar.insertHorizontalRule} title="Insert divider">
          &#8213;
        </ToolbarButton>
        <ToolbarButton onClick={toolbar.clearFormatting} title="Clear formatting">
          &#10006;
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

function BlockTypeSelect({
  value,
  onChange,
}: {
  value: BlockType;
  onChange: (type: BlockType) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as BlockType)}
      className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="paragraph">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
      <option value="bullet">Bullet List</option>
      <option value="number">Numbered List</option>
      <option value="check">Check List</option>
      <option value="quote">Quote</option>
      <option value="code">Code Block</option>
    </select>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "flex h-7 min-w-[28px] items-center justify-center rounded px-1.5 text-sm transition-colors",
        active ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        disabled ? "pointer-events-none opacity-40" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />;
}
`
  );
}

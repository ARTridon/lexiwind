import { useCallback, useEffect, useMemo, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import type { EditorState } from 'lexical';
import { $getRoot } from 'lexical';
import type { ReactNode } from 'react';
import { CodeNode, CodeHighlightNode, CodePlugin, useCodeBlock } from '@lexiwind/code';
import { TablePlugin, useTable } from '@lexiwind/table';
import {
  SlashCommandPlugin,
  SlashCommandRegistryProvider,
  defaultCommands,
} from '@lexiwind/slash-command';
import { ToolbarPlugin, useToolbar } from '@lexiwind/toolbar';
import { HistoryPlugin as LexiwindHistoryPlugin } from '@lexiwind/history';
import { ThemeProvider, useTheme } from '@lexiwind/themes';
import { EmbedPlugin, EmbedNode, defaultMatchers } from '@lexiwind/embeds';
import { createMentionsPlugin, MentionNode } from '@lexiwind/mentions';
import type { MentionResult } from '@lexiwind/core';
import {
  CollapsiblePlugin,
  INSERT_COLLAPSIBLE_COMMAND,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
} from '@lexiwind/collapsible';
import { FloatingToolbarPlugin } from '@lexiwind/floating-toolbar';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Braces,
  ChevronDown,
  Code2,
  Download,
  Eraser,
  Indent,
  Italic,
  Link,
  Moon,
  Outdent,
  Redo,
  Strikethrough,
  Sun,
  Table,
  Underline,
  Undo,
  Upload,
} from 'lucide-react';

// ─── Module-level constants ──────────────────────────────────────────────────

const MOCK_USERS: MentionResult[] = [
  { id: '1', value: 'alice', label: 'Alice Johnson' },
  { id: '2', value: 'bob', label: 'Bob Smith' },
  { id: '3', value: 'charlie', label: 'Charlie Brown' },
  { id: '4', value: 'diana', label: 'Diana Ross' },
  { id: '5', value: 'eve', label: 'Eve Williams' },
];

const MentionsPlugin = createMentionsPlugin({
  trigger: '@',
  onSearch: (query: string) =>
    MOCK_USERS.filter((u) =>
      (u.label ?? u.value).toLowerCase().includes(query.toLowerCase())
    ),
});

const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'markdown',
  'bash',
  'sql',
  'rust',
  'go',
] as const;

const EDITOR_THEME = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'mb-2 leading-relaxed',
  quote:
    'border-l-4 border-primary pl-4 text-muted-foreground italic my-3 ml-2',
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-semibold mb-3 mt-5',
    h3: 'text-xl font-semibold mb-2 mt-4',
    h4: 'text-lg font-medium mb-2 mt-3',
    h5: 'text-base font-medium mb-1 mt-2',
  },
  list: {
    nested: { listitem: 'ml-6' },
    ol: 'list-decimal ml-6 mb-2',
    ul: 'list-disc ml-6 mb-2',
    listitem: 'mb-1 pl-1',
    listitemChecked: 'line-through opacity-50',
    listitemUnchecked: '',
  },
  link: 'text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80',
  code: 'bg-muted/60 rounded-md font-mono text-sm block p-4 my-3 overflow-x-auto',
  codeHighlight: {
    atrule: 'text-purple-600 dark:text-purple-400',
    attr: 'text-orange-600 dark:text-orange-400',
    boolean: 'text-blue-600 dark:text-blue-400',
    builtin: 'text-green-600 dark:text-green-400',
    cdata: 'text-gray-500',
    char: 'text-orange-600 dark:text-orange-400',
    class: 'text-blue-600 dark:text-blue-400',
    'class-name': 'text-blue-600 dark:text-blue-400',
    comment: 'text-gray-500 italic',
    constant: 'text-blue-600 dark:text-blue-400',
    deleted: 'text-red-600 dark:text-red-400',
    doctype: 'text-gray-500',
    entity: 'text-orange-600 dark:text-orange-400',
    function: 'text-yellow-600 dark:text-yellow-400',
    important: 'text-red-600 dark:text-red-400 font-bold',
    inserted: 'text-green-600 dark:text-green-400',
    keyword: 'text-purple-600 dark:text-purple-400',
    namespace: 'text-blue-600 dark:text-blue-400',
    number: 'text-blue-600 dark:text-blue-400',
    operator: 'text-foreground',
    prolog: 'text-gray-500',
    property: 'text-blue-600 dark:text-blue-400',
    punctuation: 'text-foreground',
    regex: 'text-orange-600 dark:text-orange-400',
    selector: 'text-green-600 dark:text-green-400',
    string: 'text-green-600 dark:text-green-400',
    symbol: 'text-blue-600 dark:text-blue-400',
    tag: 'text-red-600 dark:text-red-400',
    unit: 'text-orange-600 dark:text-orange-400',
    url: 'text-blue-600 dark:text-blue-400 underline',
    variable: 'text-orange-600 dark:text-orange-400',
  },
  table: 'border-collapse w-full my-4',
  tableCell: 'border border-border p-2 align-top min-w-24',
  tableCellHeader: 'border border-border p-2 bg-muted font-semibold text-left',
  tableRow: '',
  tableAddRows: '',
  tableSelection: 'bg-primary/20',
};

const INITIAL_CONFIG = {
  namespace: 'lexiwind-reference',
  theme: EDITOR_THEME,
  onError: (error: Error) => console.error(error),
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    LinkNode,
    HorizontalRuleNode,
    EmbedNode,
    MentionNode,
    CollapsibleContainerNode,
    CollapsibleTitleNode,
    CollapsibleContentNode,
  ],
};

// ─── Toolbar button helpers ───────────────────────────────────────────────────

interface TBtnProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

function TBtn({ label, onClick, disabled, children }: TBtnProps): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

interface TToggleProps {
  label: string;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: ReactNode;
}

function TToggle({
  label,
  pressed,
  onPressedChange,
  children,
}: TToggleProps): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange}>
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function getBlockTypeLabel(blockType: string | null): string {
  const labels: Record<string, string> = {
    paragraph: 'Paragraph',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    ul: 'Bullet List',
    ol: 'Numbered List',
    check: 'Check List',
    quote: 'Quote',
    code: 'Code Block',
    other: 'Other',
  };
  return labels[blockType ?? 'paragraph'] ?? 'Paragraph';
}

// ─── Link dialog ─────────────────────────────────────────────────────────────

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl: string;
}

function LinkDialog({
  open,
  onOpenChange,
  initialUrl,
}: LinkDialogProps): JSX.Element {
  const toolbar = useToolbar();
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (open) setUrl(initialUrl);
  }, [open, initialUrl]);

  const handleApply = useCallback(() => {
    toolbar.toggleLink(url || null);
    onOpenChange(false);
  }, [toolbar, url, onOpenChange]);

  const handleRemove = useCallback(() => {
    toolbar.toggleLink(null);
    onOpenChange(false);
  }, [toolbar, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Insert link</DialogTitle>
        </DialogHeader>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          autoFocus
        />
        <DialogFooter>
          {toolbar.isLink && (
            <Button variant="outline" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          )}
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Slash commands wrapper ───────────────────────────────────────────────────

function EditorSlashCommands({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const initialCommands = useMemo(() => defaultCommands(editor), [editor]);
  return (
    <SlashCommandRegistryProvider initial={initialCommands}>
      {children}
    </SlashCommandRegistryProvider>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface EditorToolbarProps {
  onLinkClick: (currentUrl: string) => void;
}

function EditorToolbar({ onLinkClick }: EditorToolbarProps): JSX.Element {
  const toolbar = useToolbar();
  const { insertTable } = useTable();
  const { insertCodeBlock } = useCodeBlock();
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex items-center flex-wrap gap-0.5 px-2 py-1 border-b border-border bg-card">
      {/* History */}
      <TBtn
        label="Undo (Ctrl+Z)"
        onClick={() => toolbar.undo()}
        disabled={!toolbar.canUndo}
      >
        <Undo className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        label="Redo (Ctrl+Y)"
        onClick={() => toolbar.redo()}
        disabled={!toolbar.canRedo}
      >
        <Redo className="h-3.5 w-3.5" />
      </TBtn>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Block type */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs w-28 justify-between"
              >
                <span className="truncate">
                  {getBlockTypeLabel(toolbar.blockType)}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Block type</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-xs">Text style</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatParagraph()}
          >
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatHeading('h1')}
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatHeading('h2')}
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatHeading('h3')}
          >
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatQuote()}
          >
            Quote
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs">Lists</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatBulletList()}
          >
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatNumberedList()}
          >
            Numbered List
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatCheckList()}
          >
            Check List
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => toolbar.formatCode()}
          >
            Code Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Formatting toggles */}
      <TToggle
        label="Bold (Ctrl+B)"
        pressed={toolbar.isBold}
        onPressedChange={() => toolbar.toggleBold()}
      >
        <Bold className="h-3.5 w-3.5" />
      </TToggle>
      <TToggle
        label="Italic (Ctrl+I)"
        pressed={toolbar.isItalic}
        onPressedChange={() => toolbar.toggleItalic()}
      >
        <Italic className="h-3.5 w-3.5" />
      </TToggle>
      <TToggle
        label="Underline (Ctrl+U)"
        pressed={toolbar.isUnderline}
        onPressedChange={() => toolbar.toggleUnderline()}
      >
        <Underline className="h-3.5 w-3.5" />
      </TToggle>
      <TToggle
        label="Strikethrough"
        pressed={toolbar.isStrikethrough}
        onPressedChange={() => toolbar.toggleStrikethrough()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </TToggle>
      <TToggle
        label="Inline code"
        pressed={toolbar.isCode}
        onPressedChange={() => toolbar.toggleCode()}
      >
        <Code2 className="h-3.5 w-3.5" />
      </TToggle>
      <TBtn label="Clear formatting" onClick={() => toolbar.clearFormatting()}>
        <Eraser className="h-3.5 w-3.5" />
      </TBtn>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Alignment */}
      <TBtn label="Align left" onClick={() => toolbar.align('left')}>
        <AlignLeft className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn label="Align center" onClick={() => toolbar.align('center')}>
        <AlignCenter className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn label="Align right" onClick={() => toolbar.align('right')}>
        <AlignRight className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn label="Justify" onClick={() => toolbar.align('justify')}>
        <AlignJustify className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn label="Indent" onClick={() => toolbar.indent()}>
        <Indent className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn label="Outdent" onClick={() => toolbar.outdent()}>
        <Outdent className="h-3.5 w-3.5" />
      </TBtn>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Insert */}
      <TToggle
        label="Link (Ctrl+K)"
        pressed={toolbar.isLink}
        onPressedChange={() => onLinkClick(toolbar.linkUrl)}
      >
        <Link className="h-3.5 w-3.5" />
      </TToggle>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Table className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Insert table</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => insertTable({ rows: 3, columns: 3 })}
          >
            Insert 3×3 table
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={() => insertTable({ rows: 5, columns: 4 })}
          >
            Insert 5×4 table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TBtn label="Code block" onClick={() => insertCodeBlock('javascript')}>
        <Braces className="h-3.5 w-3.5" />
      </TBtn>

      <TBtn
        label="Collapsible section"
        onClick={() =>
          editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
        }
      >
        <span className="text-[10px] font-mono leading-none">▶</span>
      </TBtn>

      {/* Code language selector (shown only in code blocks) */}
      {toolbar.codeLanguage !== '' && (
        <>
          <Separator orientation="vertical" className="h-5 mx-0.5" />
          <Select
            value={toolbar.codeLanguage}
            onValueChange={(lang: string) => toolbar.setCodeLanguage(lang)}
          >
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {CODE_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang} className="text-xs">
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function EditorSidebar({ wordCount }: { wordCount: number }): JSX.Element {
  return (
    <aside className="w-48 shrink-0 border-r border-border bg-muted/20 p-3 flex flex-col gap-4 text-xs overflow-y-auto">
      <div>
        <p className="font-semibold text-foreground mb-1">Stats</p>
        <p className="text-muted-foreground">{wordCount} words</p>
      </div>
      <div>
        <p className="font-semibold text-foreground mb-2">Shortcuts</p>
        <dl className="space-y-1.5 text-muted-foreground">
          {(
            [
              ['Slash cmds', '/'],
              ['Mention', '@'],
              ['Bold', '⌃B'],
              ['Italic', '⌃I'],
              ['Underline', '⌃U'],
              ['Undo / Redo', '⌃Z / Y'],
              ['Heading 1', '# + Space'],
              ['Heading 2', '## + Space'],
              ['Quote', '> + Space'],
              ['Code block', '``` + Enter'],
              ['Bullet list', '- + Space'],
            ] as [string, string][]
          ).map(([name, shortcut]) => (
            <div key={name} className="flex justify-between gap-2">
              <dt className="font-medium text-foreground">{name}</dt>
              <dd className="font-mono shrink-0">{shortcut}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <p className="font-semibold text-foreground mb-2">Plugins active</p>
        <ul className="space-y-0.5 text-muted-foreground">
          {[
            'Toolbar',
            'Slash commands',
            'Table',
            'Code blocks',
            'Floating toolbar',
            'Embeds',
            'Mentions (@)',
            'Collapsible',
            'Markdown',
            'History',
            'Themes',
          ].map((p) => (
            <li key={p} className="flex items-center gap-1">
              <span className="text-green-500">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// ─── Editor content area ──────────────────────────────────────────────────────

interface EditorContentProps {
  onStateChange: (state: EditorState) => void;
  onLinkClick: (currentUrl: string) => void;
}

function EditorContent({
  onStateChange,
  onLinkClick,
}: EditorContentProps): JSX.Element {
  return (
    <div className="relative flex-1 overflow-y-auto">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-full px-12 py-8 outline-none text-foreground text-sm leading-relaxed" />
        }
        placeholder={
          <div className="absolute top-8 left-12 text-muted-foreground pointer-events-none select-none text-sm">
            Start typing, or press{' '}
            <kbd className="px-1 py-0.5 text-xs bg-muted rounded border border-border font-mono">
              /
            </kbd>{' '}
            for commands…
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onStateChange} />
      <HistoryPlugin />
      <LexiwindHistoryPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <CodePlugin />
      <TablePlugin />
      <SlashCommandPlugin />
      <EmbedPlugin matchers={defaultMatchers} />
      <MentionsPlugin />
      <CollapsiblePlugin />
      <FloatingToolbarPlugin onLinkClick={onLinkClick} />
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface EditorFooterProps {
  editorState: EditorState | null;
  wordCount: number;
}

function EditorFooter({
  editorState,
  wordCount,
}: EditorFooterProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const exportJSON = useCallback(() => {
    if (!editorState) return;
    const json = JSON.stringify(editorState.toJSON(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexiwind-content.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [editorState]);

  const importJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text !== 'string') return;
        try {
          const state = editor.parseEditorState(text);
          editor.setEditorState(state);
        } catch (err) {
          console.error('Failed to parse JSON editor state:', err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [editor]);

  const exportMarkdown = useCallback(() => {
    editor.read(() => {
      const md = $convertToMarkdownString(TRANSFORMERS);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lexiwind-content.md';
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [editor]);

  const importMarkdown = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,text/markdown';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text !== 'string') return;
        editor.update(() => {
          $convertFromMarkdownString(text, TRANSFORMERS);
        });
      };
      reader.readAsText(file);
    };
    input.click();
  }, [editor]);

  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-card text-xs text-muted-foreground shrink-0">
      <span>{wordCount} words</span>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={exportJSON}
              disabled={!editorState}
            >
              <Download className="h-3 w-3" />
              JSON
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export as JSON</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={importJSON}
            >
              <Upload className="h-3 w-3" />
              JSON
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import from JSON</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-4 mx-1" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={exportMarkdown}
            >
              <Download className="h-3 w-3" />
              MD
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export as Markdown</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={importMarkdown}
            >
              <Upload className="h-3 w-3" />
              MD
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import from Markdown</TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
}

// ─── Editor wrapper ──────────────────────────────────────────────────────────

function EditorWrapper(): JSX.Element {
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkDialogUrl, setLinkDialogUrl] = useState('');

  const handleStateChange = useCallback((state: EditorState) => {
    setEditorState(state);
    state.read(() => {
      const text = $getRoot().getTextContent().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
    });
  }, []);

  const handleLinkClick = useCallback((currentUrl: string) => {
    setLinkDialogUrl(currentUrl);
    setLinkDialogOpen(true);
  }, []);

  return (
    <LexicalComposer initialConfig={INITIAL_CONFIG}>
      <EditorSlashCommands>
        <ToolbarPlugin>
          <div className="flex flex-col h-full">
            <LinkDialog
              open={linkDialogOpen}
              onOpenChange={setLinkDialogOpen}
              initialUrl={linkDialogUrl}
            />
            <EditorToolbar onLinkClick={handleLinkClick} />
            <div className="flex flex-1 overflow-hidden min-h-0">
              <EditorSidebar wordCount={wordCount} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <EditorContent
                  onStateChange={handleStateChange}
                  onLinkClick={handleLinkClick}
                />
                <EditorFooter
                  editorState={editorState}
                  wordCount={wordCount}
                />
              </div>
            </div>
          </div>
        </ToolbarPlugin>
      </EditorSlashCommands>
    </LexicalComposer>
  );
}

// ─── App header ──────────────────────────────────────────────────────────────

function AppHeader(): JSX.Element {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5 shadow-sm shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-foreground tracking-tight">
          Lexiwind
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
          Reference Editor
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block text-xs text-muted-foreground">
          Rich text · Tables · Slash commands · Embeds · Markdown · Dark mode
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light" storageKey="lexiwind-demo-theme">
      <TooltipProvider delayDuration={400}>
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-hidden">
            <EditorWrapper />
          </main>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

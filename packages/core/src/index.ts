// ─── Primitives ───────────────────────────────────────────────────────────────

export type Unsubscribe = () => void;

// ─── Editor domains ───────────────────────────────────────────────────────────

export type BlockType =
  | "paragraph"
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "bullet" | "number" | "check"
  | "quote" | "code";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type ListType = "bullet" | "number" | "check";
export type Alignment = "left" | "center" | "right" | "justify";
export type FormatType =
  | "bold" | "italic" | "underline" | "strikethrough"
  | "code" | "subscript" | "superscript";

// ─── Toolbar extension ────────────────────────────────────────────────────────

/**
 * Named slots where toolbar items are inserted.
 * Order within a slot is controlled by the `order` field.
 */
export type ToolbarSlot =
  | "history"        // undo / redo
  | "format:inline"  // bold, italic, underline, strikethrough, code
  | "format:block"   // headings, quote, code block, lists
  | "insert"         // table, image, divider, embed
  | "align"          // left, center, right, justify
  | "end";           // overflow / extra items

export interface ToolbarItemDef {
  id: string;
  slot: ToolbarSlot;
  order?: number;
  render(): React.ReactNode;
  isActive?(): boolean;
  isDisabled?(): boolean;
  /** Return true to hide the item contextually (e.g., table controls outside a table). */
  hidden?(): boolean;
}

export interface ToolbarGroupDef {
  id: string;
  slot: ToolbarSlot;
  order?: number;
  items: ToolbarItemDef[];
}

// ─── Slash command extension ──────────────────────────────────────────────────

export interface SlashCommandEntry {
  /** Unique ID — plugins should namespace: "my-plugin:insert-table". */
  id: string;
  title: string;
  /** Single emoji or short text shown left of the title. */
  icon?: string;
  keywords: string[];
  /** Optional grouping label rendered as a separator in the menu. */
  group?: string;
  onSelect(queryString: string): void;
}

// ─── Mentions extension ───────────────────────────────────────────────────────

export interface MentionResult {
  id: string;
  /** Text inserted into the document. */
  value: string;
  /** Display label in the dropdown (falls back to value). */
  label?: string;
  /** Arbitrary extra data forwarded to renderResult. */
  data?: Record<string, unknown>;
}

export interface MentionsPluginOptions {
  /** Trigger character. Default: "@". */
  trigger?: string;
  /** Max results shown. Default: 5. */
  maxResults?: number;
  /**
   * Called on every keystroke. Return sync or async list of results.
   * Returning [] hides the menu. Throwing is silently swallowed.
   */
  onSearch(query: string): MentionResult[] | Promise<MentionResult[]>;
  /** Replace the default list item renderer. */
  renderResult?(result: MentionResult, isSelected: boolean): React.ReactNode;
  /**
   * Called when user picks a result. Default: insert a MentionNode with result.value.
   * Override to insert a custom node instead.
   */
  onSelect?(result: MentionResult, editor: import("lexical").LexicalEditor): void;
}

// ─── Embed extension ──────────────────────────────────────────────────────────

export interface EmbedPayload {
  /** Identifies which node/renderer handles this embed. */
  type: string;
  /** Original URL entered by the user. */
  url: string;
  /** Transformed URL suitable for an iframe src. */
  embedUrl: string;
  [key: string]: unknown;
}

export interface EmbedMatcher {
  /** Unique type key — must match EmbedPayload.type. */
  type: string;
  /** One or more patterns tested against the pasted URL. */
  patterns: RegExp[];
  /** Convert a matched URL to an EmbedPayload, or null to skip. */
  resolve(url: string): EmbedPayload | null;
}

// ─── Plugin contracts ─────────────────────────────────────────────────────────

/**
 * Metadata + lifecycle contract for a Lexiwind plugin.
 *
 * - `initialize`: isomorphic setup (register nodes, commands). Called once.
 * - `mount`:      browser-only side effects (DOM listeners, dynamic toolbar items).
 *                 Returns optional cleanup. Never called during SSR.
 * - `destroy`:    graceful teardown.
 */
export interface LexiwindPlugin<Config = unknown> {
  readonly id: string;
  readonly version: string;
  readonly displayName: string;
  readonly description?: string;
  /** IDs of other plugins that must be initialized first. */
  readonly dependencies?: string[];

  config?: Config;

  initialize?(context: PluginContext<Config>): void | Promise<void>;
  mount?(context: PluginContext<Config>): Unsubscribe | void;
  destroy?(): void;

  commands?: CommandDef[];
  shortcuts?: ShortcutDef[];
  toolbarItems?: ToolbarItemDef[];
  serializers?: NodeSerializerDef[];

  /** Typed surface exposed to other plugins via context.getPlugin(id).api. */
  api?: Record<string, unknown>;
}

export interface PluginContext<Config = unknown> {
  readonly editor: import("lexical").LexicalEditor;

  getConfig(): Config;
  getPlugin<T extends LexiwindPlugin>(id: string): T | undefined;
  /** Like getPlugin but throws if the plugin is missing. */
  requirePlugin<T extends LexiwindPlugin>(id: string): T;

  readonly isServer: boolean;
  readonly isClient: boolean;
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface CommandDef<Payload = void, Result = void> {
  id: string;
  plugin: string;
  description?: string;
  execute(payload: Payload, context: PluginContext): Result | Promise<Result>;
  canExecute?(payload: Payload, context: PluginContext): boolean;
}

export interface ShortcutDef {
  /** "mod+b", "mod+shift+x", "alt+enter". */
  key: string;
  /** References a CommandDef.id in the same plugin. */
  commandId: string;
  payload?: unknown;
  description?: string;
}

// ─── Serialization ────────────────────────────────────────────────────────────

export interface NodeSerializerDef {
  nodeType: string;
  toJSON(node: import("lexical").LexicalNode): Record<string, unknown>;
  fromJSON(
    data: import("lexical").SerializedLexicalNode,
    editor: import("lexical").LexicalEditor
  ): import("lexical").LexicalNode;
  toHTML?(node: import("lexical").LexicalNode): string;
  toMarkdown?(node: import("lexical").LexicalNode): string;
}

// ─── Lazy loading ─────────────────────────────────────────────────────────────

/**
 * Metadata is available immediately; implementation loads on demand.
 * Pass to PluginRegistry.register() the same way as a full plugin.
 */
export interface LazyPlugin {
  id: string;
  version: string;
  displayName: string;
  load(): Promise<{ default: LexiwindPlugin }>;
}

export function isLazyPlugin(p: LexiwindPlugin | LazyPlugin): p is LazyPlugin {
  return "load" in p && typeof (p as LazyPlugin).load === "function";
}

// ─── Event bus ────────────────────────────────────────────────────────────────

/**
 * Core event map. Extend via declaration merging in your package:
 *
 * declare module "@lexiwind/core" {
 *   interface LexiwindEventMap {
 *     "my-plugin:opened": { trigger: "keyboard" | "button" };
 *   }
 * }
 */
export interface LexiwindEventMap {
  "editor:ready": { editor: import("lexical").LexicalEditor };
  "editor:changed": {
    prevState: import("lexical").EditorState;
    nextState: import("lexical").EditorState;
  };
  "selection:changed": {
    selection: import("lexical").BaseSelection | null;
  };
  "plugin:registered": { id: string };
  "plugin:destroyed": { id: string };
}

export interface EventBus {
  emit<K extends keyof LexiwindEventMap>(
    event: K,
    payload: LexiwindEventMap[K]
  ): void;
  on<K extends keyof LexiwindEventMap>(
    event: K,
    handler: (payload: LexiwindEventMap[K]) => void
  ): Unsubscribe;
  once<K extends keyof LexiwindEventMap>(
    event: K,
    handler: (payload: LexiwindEventMap[K]) => void
  ): void;
}

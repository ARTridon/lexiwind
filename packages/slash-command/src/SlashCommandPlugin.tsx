"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { TextNode } from "lexical";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { SlashCommandEntry } from "@lexiwind/core";
import { SlashCommandRegistryProvider } from "./SlashCommandRegistryProvider";
import { useSlashCommandRegistry } from "./useSlashCommandRegistry";
import { defaultCommands } from './defaultCommands';

// ─── Internal option type ─────────────────────────────────────────────────────

class SlashOption extends MenuOption {
  entry: SlashCommandEntry;
  constructor(entry: SlashCommandEntry) {
    super(entry.id);
    this.entry = entry;
  }
}

// ─── Default menu renderer ────────────────────────────────────────────────────

export interface SlashMenuRenderProps {
  options: SlashCommandEntry[];
  selectedIndex: number | null;
  onSelect(entry: SlashCommandEntry): void;
  onHover(index: number): void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
}

type MenuRenderFn = (props: SlashMenuRenderProps) => React.ReactPortal | React.ReactElement | null;

function DefaultSlashMenu({
  options,
  selectedIndex,
  onSelect,
  onHover,
  anchorRef,
}: SlashMenuRenderProps) {
  // Group commands by their group label
  const grouped = useMemo(() => {
    const map = new Map<string, SlashCommandEntry[]>();
    for (const entry of options) {
      const g = entry.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(entry);
    }
    return map;
  }, [options]);

  if (!anchorRef.current || options.length === 0) return null;

  let itemIndex = 0;

  return createPortal(
    <div
      role="listbox"
      className="absolute z-50 min-w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="max-h-72 overflow-y-auto p-1">
        {Array.from(grouped.entries()).map(([group, entries]) => (
          <div key={group}>
            {group && (
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {group}
              </div>
            )}
            {entries.map((entry) => {
              const index = itemIndex++;
              return (
                <button
                  key={entry.id}
                  role="option"
                  aria-selected={selectedIndex === index}
                  onClick={() => onSelect(entry)}
                  onMouseEnter={() => onHover(index)}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                    selectedIndex === index
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                  ].join(" ")}
                >
                  {entry.icon && (
                    <span className="w-6 shrink-0 text-center font-mono text-xs text-gray-400">
                      {entry.icon}
                    </span>
                  )}
                  <span>{entry.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>,
    anchorRef.current
  );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export interface SlashCommandPluginProps {
  /**
   * Replace the entire menu UI. Receives filtered options and interaction
   * callbacks; responsible for rendering into a portal at anchorRef.
   */
  renderMenu?: MenuRenderFn;
  /**
   * Include the built-in core commands (headings, lists, etc.).
   * Set to false if you want to supply all commands yourself.
   * Default: true.
   */
  includeDefaults?: boolean;
}

function SlashCommandPluginInner({
  renderMenu,
  includeDefaults = true,
}: SlashCommandPluginProps) {
  const [editor] = useLexicalComposerContext();
  const { commands, register } = useSlashCommandRegistry();
  const [queryString, setQueryString] = useState<string | null>(null);

  // Register default commands once (after registry is available)
  const defaultsRegistered = useRef(false);
  useEffect(() => {
    if (!includeDefaults || defaultsRegistered.current) return;
    defaultsRegistered.current = true;
    const cleanups = defaultCommands(editor).map(register);
    return () => cleanups.forEach((fn: () => void) => fn());
  }, [editor, register, includeDefaults]);

  const trigger = useBasicTypeaheadTriggerMatch("/", { minLength: 0, maxLength: 75 });

  const options = useMemo<SlashOption[]>(() => {
    if (!queryString) return commands.map((e: SlashCommandEntry) => new SlashOption(e));
    const re = new RegExp(
      queryString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    return commands
      .filter((e: SlashCommandEntry) => re.test(e.title) || e.keywords.some((k: string) => re.test(k)))
      .map((e: SlashCommandEntry) => new SlashOption(e));
  }, [commands, queryString]);

  const onSelectOption = useCallback(
    (
      selected: SlashOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selected.entry.onSelect(queryString ?? "");
        closeMenu();
      });
    },
    [editor, queryString]
  );

  const menuRenderFn = useCallback(
    (
      anchorRef: React.MutableRefObject<HTMLElement | null>,
      {
        selectedIndex,
        selectOptionAndCleanUp,
        setHighlightedIndex,
        options: opts,
      }: {
        selectedIndex: number | null;
        selectOptionAndCleanUp(o: SlashOption): void;
        setHighlightedIndex(i: number): void;
        options: SlashOption[];
      }
    ): React.ReactPortal | React.ReactElement | null => {
      const entries = opts.map((o) => o.entry);

      const props: SlashMenuRenderProps = {
        options: entries,
        selectedIndex,
        onSelect: (entry) => {
          const opt = opts.find((o) => o.entry.id === entry.id);
          if (opt) selectOptionAndCleanUp(opt);
        },
        onHover: setHighlightedIndex,
        anchorRef,
      };

      return (renderMenu ? renderMenu(props) : <DefaultSlashMenu {...props} />) ?? null;
    },
    [renderMenu]
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={trigger}
      options={options}
      menuRenderFn={menuRenderFn}
    />
  );
}

/**
 * Drop-in slash-command picker with an extensible registry.
 *
 * Any plugin can add commands at runtime:
 * ```tsx
 * const { register } = useSlashCommandRegistry();
 * useEffect(() => register({ id: "my-plugin:action", ... }), [register]);
 * ```
 *
 * If you're wrapping this in a custom editor that already renders
 * SlashCommandRegistryProvider, pass `withProvider={false}` to avoid nesting.
 */
export function SlashCommandPlugin(
  props: SlashCommandPluginProps & { withProvider?: boolean }
) {
  const { withProvider = true, ...rest } = props;

  if (withProvider) {
    return (
      <SlashCommandRegistryProvider>
        <SlashCommandPluginInner {...rest} />
      </SlashCommandRegistryProvider>
    );
  }

  return <SlashCommandPluginInner {...rest} />;
}

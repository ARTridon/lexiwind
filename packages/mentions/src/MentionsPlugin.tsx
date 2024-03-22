"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { TextNode } from "lexical";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { MentionResult, MentionsPluginOptions } from "@lexiwind/core";
import { $createMentionNode, MentionNode } from './MentionNode';

// ─── Typeahead trigger ────────────────────────────────────────────────────────

const PUNCTUATION = "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const VALID_CHAR = "[^\\s\\@" + PUNCTUATION + "]";
const LENGTH_LIMIT = 75;
const AT_SIGN_REGEX = new RegExp(
  "(^|\\s|\\()(\\@((?:" + VALID_CHAR + "){0," + LENGTH_LIMIT + "}))$"
);

function checkForMentionMatch(
  trigger: string,
  text: string,
  minLength: number
): MenuTextMatch | null {
  if (trigger !== "@") {
    // Generic trigger support
    const pattern = new RegExp(
      `(^|\\s)(\\${trigger}((?:[^\\s\\${trigger}]){0,${LENGTH_LIMIT}}))$`
    );
    const m = pattern.exec(text);
    if (!m) return null;
    if (m[3].length < minLength) return null;
    return {
      leadOffset: m.index + m[1].length,
      matchingString: m[3],
      replaceableString: m[2],
    };
  }

  const m = AT_SIGN_REGEX.exec(text);
  if (!m) return null;
  if (m[3].length < minLength) return null;
  return {
    leadOffset: m.index + m[1].length,
    matchingString: m[3],
    replaceableString: m[2],
  };
}

// ─── Internal menu option ─────────────────────────────────────────────────────

class MentionOption extends MenuOption {
  result: MentionResult;
  constructor(result: MentionResult) {
    super(result.id);
    this.result = result;
  }
}

// ─── Plugin implementation ────────────────────────────────────────────────────

/**
 * Creates a MentionsPlugin component pre-configured with your data source.
 *
 * @example
 * ```tsx
 * const MyMentions = createMentionsPlugin({
 *   onSearch: async (q) => {
 *     const users = await api.searchUsers(q);
 *     return users.map(u => ({ id: u.id, value: u.username }));
 *   },
 * });
 *
 * // Then inside your editor:
 * <MyMentions />
 * ```
 */
export function createMentionsPlugin(
  options: MentionsPluginOptions
): () => ReactNode {
  const {
    trigger = "@",
    maxResults = 5,
    onSearch,
    renderResult,
    onSelect: customOnSelect,
  } = options;

  return function MentionsPlugin() {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = useState<string | null>(null);
    const [results, setResults] = useState<MentionResult[]>([]);
    const cacheRef = useRef<Map<string, MentionResult[]>>(new Map());

    // Verify node is registered
    useEffect(() => {
      if (!editor.hasNodes([MentionNode])) {
        throw new Error(
          "MentionsPlugin: MentionNode is not registered. Add it to your editor config.nodes."
        );
      }
    }, [editor]);

    // Debounced search
    useEffect(() => {
      if (queryString == null) { setResults([]); return; }
      const cached = cacheRef.current.get(queryString);
      if (cached) { setResults(cached.slice(0, maxResults)); return; }

      let cancelled = false;
      const timer = setTimeout(async () => {
        try {
          const res = await onSearch(queryString);
          if (!cancelled) {
            cacheRef.current.set(queryString, res);
            setResults(res.slice(0, maxResults));
          }
        } catch {
          if (!cancelled) setResults([]);
        }
      }, 150);

      return () => { cancelled = true; clearTimeout(timer); };
    }, [queryString]); // eslint-disable-line react-hooks/exhaustive-deps

    const checkForSlashTrigger = useBasicTypeaheadTriggerMatch("/", { minLength: 0 });

    const triggerFn = useCallback(
      (text: string) => {
        if (checkForSlashTrigger(text, editor) !== null) return null;
        return checkForMentionMatch(trigger, text, 0);
      },
      [checkForSlashTrigger, editor] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const menuOptions = useMemo(
      () => results.map((r) => new MentionOption(r)),
      [results]
    );

    const onSelectOption = useCallback(
      (
        selected: MentionOption,
        nodeToReplace: TextNode | null,
        closeMenu: () => void
      ) => {
        editor.update(() => {
          if (customOnSelect) {
            nodeToReplace?.remove();
            customOnSelect(selected.result, editor);
          } else {
            const node = $createMentionNode(
              selected.result.id,
              selected.result.value,
              trigger + (selected.result.label ?? selected.result.value),
              selected.result.data
            );
            if (nodeToReplace) nodeToReplace.replace(node);
            node.select();
          }
          closeMenu();
        });
      },
      [editor, customOnSelect] // eslint-disable-line react-hooks/exhaustive-deps
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
          selectOptionAndCleanUp(o: MentionOption): void;
          setHighlightedIndex(i: number): void;
          options: MentionOption[];
        }
      ) => {
        if (!anchorRef.current || opts.length === 0) return null;
        return createPortal(
          <div
            role="listbox"
            className="min-w-[180px] max-h-[240px] overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {opts.map((opt, i) => (
              <div
                key={opt.result.id}
                role="option"
                aria-selected={selectedIndex === i}
                ref={(el) => opt.setRefElement(el)}
                onClick={() => selectOptionAndCleanUp(opt)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {renderResult ? (
                  renderResult(opt.result, selectedIndex === i)
                ) : (
                  <div
                    className={[
                      "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm",
                      selectedIndex === i
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                    ].join(" ")}
                  >
                    {opt.result.data?.avatar ? (
                      <img
                        src={opt.result.data.avatar as string}
                        alt=""
                        className="h-5 w-5 rounded-full"
                      />
                    ) : null}
                    <span className="font-medium">{opt.result.label ?? opt.result.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>,
          anchorRef.current
        );
      },
      [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return (
      <LexicalTypeaheadMenuPlugin<MentionOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={triggerFn}
        options={menuOptions}
        menuRenderFn={menuRenderFn}
      />
    );
  };
}

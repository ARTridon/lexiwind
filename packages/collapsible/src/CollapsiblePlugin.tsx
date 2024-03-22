"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $findMatchingParent,
  $insertNodeToNearestRoot,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  createCommand,
  type LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import {
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
  CollapsibleContainerNode,
} from './CollapsibleContainerNode';
import {
  $createCollapsibleContentNode,
  $isCollapsibleContentNode,
  CollapsibleContentNode,
} from './CollapsibleContentNode';
import {
  $createCollapsibleTitleNode,
  $isCollapsibleTitleNode,
  CollapsibleTitleNode,
} from './CollapsibleTitleNode';

export const INSERT_COLLAPSIBLE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_COLLAPSIBLE_COMMAND"
);

/**
 * Collapsible block plugin.
 *
 * - No CSS file — styles are applied via Tailwind classes in the node's createDOM()
 * - Theme classes are configurable via `editor.initialConfig.theme.collapsible`
 * - Arrow key navigation escapes the container at boundaries
 * - Enter on the title row opens the content area
 *
 * Register nodes before use:
 * ```ts
 * nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode]
 * ```
 *
 * Customize styles:
 * ```ts
 * theme: {
 *   collapsible: {
 *     titleClass: "flex items-center gap-2 font-semibold py-2 px-4 cursor-pointer",
 *     contentClass: "px-4 pb-4",
 *   }
 * }
 * ```
 */
export function CollapsiblePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (
      !editor.hasNodes([
        CollapsibleContainerNode,
        CollapsibleTitleNode,
        CollapsibleContentNode,
      ])
    ) {
      throw new Error(
        "CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, and " +
          "CollapsibleContentNode must be registered in the editor config."
      );
    }

    const $escapeUp = () => {
      const sel = $getSelection();
      if (!sel || !$isRangeSelection(sel) || !sel.isCollapsed() || sel.anchor.offset !== 0)
        return false;
      const container = $findMatchingParent(sel.anchor.getNode(), $isCollapsibleContainerNode);
      if (!$isCollapsibleContainerNode(container)) return false;
      const parent = container.getParent();
      const firstDesc = container.getFirstDescendant();
      if (
        parent?.getFirstChild() === container &&
        firstDesc &&
        sel.anchor.key === firstDesc.getKey()
      ) {
        container.insertBefore($createParagraphNode());
      }
      return false;
    };

    const $escapeDown = () => {
      const sel = $getSelection();
      if (!sel || !$isRangeSelection(sel) || !sel.isCollapsed()) return false;
      const container = $findMatchingParent(sel.anchor.getNode(), $isCollapsibleContainerNode);
      if (!$isCollapsibleContainerNode(container)) return false;
      const parent = container.getParent();
      if (parent?.getLastChild() !== container) return false;
      const titleDesc = container.getFirstDescendant();
      const contentDesc = container.getLastDescendant();
      const { key, offset } = sel.anchor;
      if (
        (contentDesc && key === contentDesc.getKey() && offset === contentDesc.getTextContentSize()) ||
        (titleDesc && key === titleDesc.getKey() && offset === titleDesc.getTextContentSize())
      ) {
        container.insertAfter($createParagraphNode());
      }
      return false;
    };

    return mergeRegister(
      // Structural integrity transforms
      editor.registerNodeTransform(CollapsibleContentNode, (node) => {
        if (!$isCollapsibleContainerNode(node.getParent())) {
          for (const child of node.getChildren()) node.insertBefore(child);
          node.remove();
        }
      }),
      editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
        if (!$isCollapsibleContainerNode(node.getParent())) {
          node.replace($createParagraphNode().append(...node.getChildren()));
        }
      }),
      editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
        const children = node.getChildren();
        if (
          children.length !== 2 ||
          !$isCollapsibleTitleNode(children[0]) ||
          !$isCollapsibleContentNode(children[1])
        ) {
          for (const child of children) node.insertBefore(child);
          node.remove();
        }
      }),

      // Arrow key escape
      editor.registerCommand(KEY_ARROW_UP_COMMAND, $escapeUp, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_LEFT_COMMAND, $escapeUp, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_DOWN_COMMAND, $escapeDown, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ARROW_RIGHT_COMMAND, $escapeDown, COMMAND_PRIORITY_LOW),

      // Enter on title → open + move to content
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const sel = $getSelection();
          if (!sel || !$isRangeSelection(sel)) return false;
          const titleNode = $findMatchingParent(sel.anchor.getNode(), $isCollapsibleTitleNode);
          if (!$isCollapsibleTitleNode(titleNode)) return false;
          const container = titleNode.getParent();
          if (!$isCollapsibleContainerNode(container)) return false;
          if (!container.getOpen()) container.toggleOpen();
          titleNode.getNextSibling()?.selectEnd();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),

      // Insert new collapsible
      editor.registerCommand(
        INSERT_COLLAPSIBLE_COMMAND,
        () => {
          editor.update(() => {
            const titleParagraph = $createParagraphNode();
            const title = $createCollapsibleTitleNode().append(titleParagraph);
            const content = $createCollapsibleContentNode().append($createParagraphNode());
            $insertNodeToNearestRoot(
              $createCollapsibleContainerNode(true).append(title, content)
            );
            titleParagraph.select();
          });
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}

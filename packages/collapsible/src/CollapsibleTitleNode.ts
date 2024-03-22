import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedElementNode,
} from "lexical";
import { ElementNode } from "lexical";
import {
  $isCollapsibleContainerNode,
  type CollapsibleContainerNode,
} from './CollapsibleContainerNode';

export type CollapsibleTheme = {
  /** Classes applied to the title row element. */
  titleClass?: string;
  /** Classes for the expand/collapse toggle icon wrapper. */
  toggleIconClass?: string;
  /** Classes for the icon when the section is open. */
  iconOpenClass?: string;
  /** Classes for the icon when the section is closed. */
  iconClosedClass?: string;
};

const defaultTheme: Required<CollapsibleTheme> = {
  titleClass:
    "flex cursor-pointer select-none items-center gap-2 rounded-t-lg px-4 py-2 font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800",
  toggleIconClass: "shrink-0 text-gray-400 transition-transform",
  iconOpenClass: "rotate-90",
  iconClosedClass: "rotate-0",
};

export class CollapsibleTitleNode extends ElementNode {
  static getType(): string { return "collapsible-title"; }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const theme = (config.theme?.collapsible as CollapsibleTheme | undefined);
    const t = { ...defaultTheme, ...theme };

    const dom = document.createElement("summary");
    dom.className = t.titleClass;

    // Toggle icon ▶
    const icon = document.createElement("span");
    icon.className = t.toggleIconClass;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "▶";
    dom.prepend(icon);

    // Click handler — updates Lexical state, not just DOM
    dom.addEventListener("click", () => {
      editor.update(() => {
        const container = this.getLatest().getParent<CollapsibleContainerNode>();
        if ($isCollapsibleContainerNode(container)) container.toggleOpen();
      });
    });

    // Sync icon rotation with open state
    const syncIcon = () => {
      const container = editor
        .getEditorState()
        .read(() => this.getLatest().getParent<CollapsibleContainerNode>());
      if ($isCollapsibleContainerNode(container)) {
        const isOpen = container.getOpen();
        icon.className = [
          t.toggleIconClass,
          isOpen ? t.iconOpenClass : t.iconClosedClass,
        ].join(" ");
      }
    };

    editor.registerUpdateListener(syncIcon);

    return dom;
  }

  updateDOM(): boolean { return false; }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: (_node: HTMLElement) => ({
        conversion: (): DOMConversionOutput => ({ node: $createCollapsibleTitleNode() }),
        priority: 1,
      }),
    };
  }

  static importJSON(_serialized: SerializedElementNode): CollapsibleTitleNode {
    return $createCollapsibleTitleNode();
  }

  exportDOM(): DOMExportOutput {
    return { element: document.createElement("summary") };
  }

  exportJSON(): SerializedElementNode {
    return { ...super.exportJSON(), type: "collapsible-title" };
  }

  collapseAtStart(): boolean { return true; }
  isShadowRoot(): boolean { return false; }
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode();
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode;
}

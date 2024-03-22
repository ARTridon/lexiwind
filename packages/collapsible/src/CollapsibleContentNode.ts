import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
} from "lexical";
import { ElementNode } from "lexical";
import type { CollapsibleTheme } from './CollapsibleTitleNode';

const defaultContentClass =
  "px-4 py-2 text-gray-700 dark:text-gray-300";

export class CollapsibleContentNode extends ElementNode {
  static getType(): string { return "collapsible-content"; }

  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const theme = (config.theme?.collapsible as CollapsibleTheme | undefined);
    const dom = document.createElement("div");
    dom.className = (theme as { contentClass?: string } | undefined)?.contentClass
      ?? defaultContentClass;
    return dom;
  }

  updateDOM(): boolean { return false; }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: HTMLElement) => {
        if (!node.hasAttribute("data-collapsible-content")) return null;
        return {
          conversion: (): DOMConversionOutput => ({ node: $createCollapsibleContentNode() }),
          priority: 2,
        };
      },
    };
  }

  static importJSON(_serialized: SerializedElementNode): CollapsibleContentNode {
    return $createCollapsibleContentNode();
  }

  exportDOM(): DOMExportOutput {
    const el = document.createElement("div");
    el.setAttribute("data-collapsible-content", "true");
    return { element: el };
  }

  exportJSON(): SerializedElementNode {
    return { ...super.exportJSON(), type: "collapsible-content" };
  }
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return new CollapsibleContentNode();
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode;
}

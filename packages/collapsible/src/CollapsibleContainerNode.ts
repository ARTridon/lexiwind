import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from "lexical";
import { $isElementNode, ElementNode } from "lexical";

export type SerializedCollapsibleContainerNode = Spread<
  { open: boolean },
  SerializedElementNode
>;

// Chrome doesn't support `hidden="until-found"` yet (needed for Ctrl+F in closed
// sections), so we use a plain div + data-open attribute instead of <details>.
// Non-Chrome browsers use <details> natively.
const IS_CHROME =
  typeof navigator !== "undefined" &&
  /Chrome/.test(navigator.userAgent) &&
  !/Chromium/.test(navigator.userAgent);

function setContentHidden(contentEl: Element, hidden: boolean) {
  if (IS_CHROME) {
    (contentEl as HTMLElement).style.display = hidden ? "none" : "";
  }
}

export class CollapsibleContainerNode extends ElementNode {
  __open: boolean;

  constructor(open: boolean, key?: NodeKey) {
    super(key);
    this.__open = open;
  }

  static getType(): string { return "collapsible-container"; }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key);
  }

  isShadowRoot(): boolean { return true; }

  collapseAtStart(_selection: RangeSelection): boolean {
    const nodesToInsert: LexicalNode[] = [];
    for (const child of this.getChildren()) {
      if ($isElementNode(child)) nodesToInsert.push(...child.getChildren());
    }
    for (let i = nodesToInsert.length - 1; i >= 0; i--) {
      this.insertBefore(nodesToInsert[i]);
    }
    this.remove();
    return true;
  }

  createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
    if (IS_CHROME) {
      const div = document.createElement("div");
      div.setAttribute("data-collapsible", "true");
      if (this.__open) div.setAttribute("data-open", "true");
      return div;
    }

    const details = document.createElement("details");
    details.open = this.__open;
    details.addEventListener("toggle", () => {
      const open = editor.getEditorState().read(() => this.getOpen());
      if (open !== details.open) {
        editor.update(() => this.toggleOpen());
      }
    });
    return details;
  }

  updateDOM(
    prevNode: CollapsibleContainerNode,
    dom: HTMLElement
  ): boolean {
    if (prevNode.__open !== this.__open) {
      if (IS_CHROME) {
        if (this.__open) dom.setAttribute("data-open", "true");
        else dom.removeAttribute("data-open");
        const content = dom.children[1] as HTMLElement | undefined;
        if (content) setContentHidden(content, !this.__open);
      } else {
        (dom as HTMLDetailsElement).open = this.__open;
      }
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      details: (_node: HTMLElement) => ({
        conversion: (el: HTMLElement): DOMConversionOutput | null => ({
          node: $createCollapsibleContainerNode(
            (el as HTMLDetailsElement).open ?? true
          ),
        }),
        priority: 1,
      }),
    };
  }

  static importJSON(
    serialized: SerializedCollapsibleContainerNode
  ): CollapsibleContainerNode {
    const node = $createCollapsibleContainerNode(serialized.open);
    node.setFormat(serialized.format);
    node.setIndent(serialized.indent);
    node.setDirection(serialized.direction);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const el = document.createElement("details");
    el.setAttribute("open", String(this.__open));
    return { element: el };
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return { ...super.exportJSON(), type: "collapsible-container", open: this.__open };
  }

  setOpen(open: boolean): void { this.getWritable().__open = open; }
  getOpen(): boolean { return this.getLatest().__open; }
  toggleOpen(): void { this.setOpen(!this.getOpen()); }
}

export function $createCollapsibleContainerNode(
  open = true
): CollapsibleContainerNode {
  return new CollapsibleContainerNode(open);
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}

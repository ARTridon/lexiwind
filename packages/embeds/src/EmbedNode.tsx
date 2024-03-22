import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { ReactNode } from "react";
import type { EmbedPayload } from "@lexiwind/core";

// ─── Serialized form ──────────────────────────────────────────────────────────

export type SerializedEmbedNode = Spread<
  { payload: EmbedPayload },
  SerializedLexicalNode
>;

// ─── Node ─────────────────────────────────────────────────────────────────────

/**
 * Generic embed node that stores an EmbedPayload and delegates rendering
 * to the EmbedPlugin's `renderEmbed` callback.
 *
 * Using one node type for all embeds means:
 * - A single node registration instead of one per service
 * - Serialization is uniform: `{ type: "embed", payload: { type: "youtube", ... } }`
 * - New embed types don't need new node classes
 */
export class EmbedNode extends DecoratorNode<ReactNode> {
  __payload: EmbedPayload;

  static getType(): string {
    return "embed";
  }

  static clone(node: EmbedNode): EmbedNode {
    return new EmbedNode(node.__payload, node.__key);
  }

  constructor(payload: EmbedPayload, key?: NodeKey) {
    super(key);
    this.__payload = payload;
  }

  static importJSON(serialized: SerializedEmbedNode): EmbedNode {
    return new EmbedNode(serialized.payload);
  }

  exportJSON(): SerializedEmbedNode {
    return {
      type: "embed",
      version: 1,
      payload: this.__payload,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const el = document.createElement("div");
    el.className = "embed-container";
    return el;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    const el = document.createElement("div");
    el.setAttribute("data-lexical-embed-type", this.__payload.type);
    el.setAttribute("data-lexical-embed-url", this.__payload.url);
    const iframe = document.createElement("iframe");
    iframe.src = this.__payload.embedUrl;
    iframe.setAttribute("allowfullscreen", "true");
    el.appendChild(iframe);
    return { element: el };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: HTMLElement) => {
        if (!node.hasAttribute("data-lexical-embed-type")) return null;
        return {
          conversion: (el: HTMLElement): DOMConversionOutput | null => {
            const type = el.getAttribute("data-lexical-embed-type") ?? "";
            const url = el.getAttribute("data-lexical-embed-url") ?? "";
            const iframe = el.querySelector("iframe");
            const embedUrl = iframe?.src ?? url;
            if (!type || !url) return null;
            return {
              node: $createEmbedNode({ type, url, embedUrl }),
            };
          },
          priority: 1,
        };
      },
    };
  }

  isInline(): false {
    return false;
  }

  getPayload(): EmbedPayload {
    return this.getLatest().__payload;
  }

  /** Rendered by the EmbedPlugin's decorate() lifecycle. */
  decorate(_editor: LexicalEditor, _config: EditorConfig): ReactNode {
    return null;
  }
}

export function $createEmbedNode(payload: EmbedPayload): EmbedNode {
  return $applyNodeReplacement(new EmbedNode(payload));
}

export function $isEmbedNode(
  node: LexicalNode | null | undefined
): node is EmbedNode {
  return node instanceof EmbedNode;
}

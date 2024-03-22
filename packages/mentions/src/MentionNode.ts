import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from "lexical";
import { $applyNodeReplacement, TextNode } from "lexical";

export type SerializedMentionNode = Spread<
  {
    mentionId: string;
    mentionValue: string;
    /** Arbitrary extra data (avatar URL, user role, etc.) */
    mentionData?: Record<string, unknown>;
  },
  SerializedTextNode
>;

export class MentionNode extends TextNode {
  __mentionId: string;
  __mentionValue: string;
  __mentionData: Record<string, unknown> | undefined;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(
      node.__mentionId,
      node.__mentionValue,
      node.getTextContent(),
      node.__mentionData,
      node.__key
    );
  }

  constructor(
    mentionId: string,
    mentionValue: string,
    text?: string,
    mentionData?: Record<string, unknown>,
    key?: NodeKey
  ) {
    super(text ?? mentionValue, key);
    this.__mentionId = mentionId;
    this.__mentionValue = mentionValue;
    this.__mentionData = mentionData;
  }

  static importJSON(serialized: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serialized.mentionId,
      serialized.mentionValue,
      serialized.text,
      serialized.mentionData
    );
    node.setFormat(serialized.format);
    node.setDetail(serialized.detail);
    node.setMode(serialized.mode);
    node.setStyle(serialized.style);
    return node;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      type: "mention",
      mentionId: this.__mentionId,
      mentionValue: this.__mentionValue,
      mentionData: this.__mentionData,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.setAttribute("data-lexical-mention", "true");
    dom.setAttribute("data-mention-id", this.__mentionId);
    dom.className = "mention";
    dom.spellcheck = false;
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const el = document.createElement("span");
    el.setAttribute("data-lexical-mention", "true");
    el.setAttribute("data-mention-id", this.__mentionId);
    el.setAttribute("data-mention-value", this.__mentionValue);
    el.textContent = this.getTextContent();
    return { element: el };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-mention")) return null;
        return { conversion: $convertMentionElement, priority: 1 };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  getMentionId(): string {
    return this.getLatest().__mentionId;
  }

  getMentionValue(): string {
    return this.getLatest().__mentionValue;
  }

  getMentionData(): Record<string, unknown> | undefined {
    return this.getLatest().__mentionData;
  }
}

function $convertMentionElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const id = domNode.getAttribute("data-mention-id") ?? "";
  const value = domNode.getAttribute("data-mention-value") ?? domNode.textContent ?? "";
  const node = $createMentionNode(id, value, domNode.textContent ?? value);
  return { node };
}

export function $createMentionNode(
  mentionId: string,
  mentionValue: string,
  text?: string,
  mentionData?: Record<string, unknown>
): MentionNode {
  const node = new MentionNode(mentionId, mentionValue, text, mentionData);
  node.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(node);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}

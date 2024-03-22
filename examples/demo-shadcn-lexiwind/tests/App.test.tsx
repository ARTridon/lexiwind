/**
 * Demo application smoke + integration tests.
 *
 * Validates that the reference editor (examples/demo-shadcn-lexiwind) actually
 * boots: editor mounts, toolbar renders, plugins register without warnings,
 * and the markdown serialization round-trip works.
 *
 * Mocking is kept minimal — only browser APIs jsdom does not implement
 * (URL.createObjectURL for the markdown export download).
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeAll, vi } from "vitest";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { createEditor } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexiwind/code";

import { App } from "@/App";

// ─── jsdom shims ──────────────────────────────────────────────────────────────

beforeAll(() => {
  if (typeof URL.createObjectURL !== "function") {
    (URL as unknown as { createObjectURL: () => string }).createObjectURL =
      () => "blob:mock";
  }
  if (typeof URL.revokeObjectURL !== "function") {
    (URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL =
      () => undefined;
  }
});

// ─── Module surface ───────────────────────────────────────────────────────────

describe("demo app — module surface", () => {
  it("exports App as a function component", () => {
    expect(typeof App).toBe("function");
  });
});

// ─── Mount / boot ─────────────────────────────────────────────────────────────

describe("demo app — boot", () => {
  it("mounts and unmounts without crash", () => {
    expect(() => {
      const { unmount } = render(<App />);
      unmount();
    }).not.toThrow();
  });

  it("applies a data-theme attribute on the document root", () => {
    const { unmount } = render(<App />);
    expect(document.documentElement.getAttribute("data-theme")).not.toBeNull();
    unmount();
  });
});

// ─── Editor surface ───────────────────────────────────────────────────────────

describe("demo app — editor surface", () => {
  it("renders a contenteditable region", () => {
    const { container, unmount } = render(<App />);
    const editable = container.querySelector('[contenteditable="true"]');
    expect(editable).not.toBeNull();
    unmount();
  });

  it("renders the Lexiwind title in the header", () => {
    const { unmount } = render(<App />);
    expect(screen.getByText(/Lexiwind/i)).toBeInTheDocument();
    unmount();
  });
});

// ─── Toolbar rendering ────────────────────────────────────────────────────────

describe("demo app — toolbar", () => {
  it("renders a meaningful number of toolbar buttons", () => {
    const { unmount } = render(<App />);
    // The shadcn toolbar groups undo/redo, block type, formats, alignment,
    // indent, and insert controls. We expect at least 10 buttons rendered.
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(10);
    unmount();
  });

  it("renders SVG icons for toolbar controls (lucide-react)", () => {
    const { unmount } = render(<App />);
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(5);
    unmount();
  });
});

// ─── Sidebar & footer ─────────────────────────────────────────────────────────

describe("demo app — sidebar & footer", () => {
  it("renders word-count indicators (sidebar + footer)", () => {
    const { unmount } = render(<App />);
    // "0 words" appears in both the sidebar Stats block and the footer
    const matches = screen.getAllByText(/\d+\s+words/i);
    expect(matches.length).toBeGreaterThanOrEqual(2);
    unmount();
  });

  it("renders the JSON + MD import/export buttons in the footer", () => {
    const { unmount } = render(<App />);
    // Footer buttons use short labels "JSON" and "MD"; Import/Export text
    // lives inside Tooltip portals that only mount on hover.
    const jsonButtons = screen.getAllByText(/^JSON$/);
    const mdButtons = screen.getAllByText(/^MD$/);
    expect(jsonButtons.length).toBe(2); // export + import JSON
    expect(mdButtons.length).toBe(2); // export + import MD
    unmount();
  });
});

// ─── Plugin registration ──────────────────────────────────────────────────────

describe("demo app — plugin registration", () => {
  it("does not log 'node not registered' errors on mount", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const { unmount } = render(<App />);

    const allCalls = [...warn.mock.calls, ...error.mock.calls].flat();
    const missingNode = allCalls.find(
      (msg) =>
        typeof msg === "string" &&
        /is not registered|missing.*node/i.test(msg)
    );
    expect(missingNode).toBeUndefined();

    unmount();
    warn.mockRestore();
    error.mockRestore();
  });
});

// ─── Markdown serialization (the same flow the demo footer uses) ──────────────

describe("demo app — markdown serialization round-trip", () => {
  it("converts markdown into a Lexical state and back without losing content", () => {
    const editor = createEditor({
      namespace: "demo-serialization-test",
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        CodeHighlightNode,
      ],
      onError: (err) => {
        throw err;
      },
    });

    const sourceMarkdown =
      "# Hello\n\nThis is **bold** and *italic* text.\n\n- one\n- two\n";

    editor.update(
      () => {
        $convertFromMarkdownString(sourceMarkdown, TRANSFORMERS);
      },
      { discrete: true }
    );

    let exported = "";
    editor.read(() => {
      exported = $convertToMarkdownString(TRANSFORMERS);
    });

    expect(exported).toContain("Hello");
    expect(exported).toContain("bold");
    expect(exported).toContain("italic");
    expect(exported).toMatch(/[-*]\s+one/);
  });
});

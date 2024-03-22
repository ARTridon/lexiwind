/**
 * Integration smoke tests: multiple packages wired together, similar to
 * how a real application would use Lexiwind.
 *
 * These tests verify that the packages compose correctly — no crashes, no
 * missing-context errors, no broken node registrations.
 */

import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LexiwindEditor } from "@lexiwind/react";
import { HistoryPlugin } from "@lexiwind/history";
import { ToolbarPlugin } from "@lexiwind/toolbar";
import { SlashCommandPlugin } from "@lexiwind/slash-command";
import { createMentionsPlugin, MentionNode } from "@lexiwind/mentions";
import { EmbedPlugin, EmbedNode } from "@lexiwind/embeds";
import {
  CollapsiblePlugin,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
} from "@lexiwind/collapsible";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MentionsPlugin = createMentionsPlugin({ onSearch: async () => [] });

const ALL_NODES = [
  MentionNode,
  EmbedNode,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
];

// ─── Basic composition ────────────────────────────────────────────────────────

describe("integration — editor + history + toolbar", () => {
  it("boots without crash", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor namespace="smoke-integration">
          <HistoryPlugin />
          <ToolbarPlugin>
            <span />
          </ToolbarPlugin>
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });

  it("passes onChange callbacks through safely", async () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <LexiwindEditor namespace="smoke-onchange" onChange={onChange}>
        <HistoryPlugin />
      </LexiwindEditor>
    );
    unmount();
  });
});

// ─── Slash commands ───────────────────────────────────────────────────────────

describe("integration — slash command registry", () => {
  it("SlashCommandRegistryProvider + SlashCommandPlugin mount together", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor namespace="smoke-slash">
          <HistoryPlugin />
          <SlashCommandPlugin renderMenu={() => null} />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── Plugin-heavy full editor ─────────────────────────────────────────────────

describe("integration — all plugins together", () => {
  it("mounts every plugin in one tree without crash", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor namespace="smoke-all" config={{ nodes: ALL_NODES }}>
          <HistoryPlugin />
          <ToolbarPlugin>
            <span />
          </ToolbarPlugin>
          <SlashCommandPlugin renderMenu={() => null} />
          <MentionsPlugin />
          <EmbedPlugin matchers={[]} autoPaste={false} />
          <CollapsiblePlugin />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── Node registration guards ─────────────────────────────────────────────────

describe("integration — node registration guards", () => {
  it("EmbedPlugin throws when EmbedNode is not registered", () => {
    // Suppress the expected React error boundary output
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      const { unmount } = render(
        <LexiwindEditor namespace="smoke-no-embed-node">
          <EmbedPlugin matchers={[]} />
        </LexiwindEditor>
      );
      unmount();
    }).toThrow("EmbedPlugin: EmbedNode is not registered");

    consoleError.mockRestore();
  });

  it("CollapsiblePlugin throws when collapsible nodes are not registered", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      const { unmount } = render(
        <LexiwindEditor namespace="smoke-no-collapsible-nodes">
          <CollapsiblePlugin />
        </LexiwindEditor>
      );
      unmount();
    }).toThrow("CollapsiblePlugin: CollapsibleContainerNode");

    consoleError.mockRestore();
  });
});

// ─── Controlled value lifecycle ────────────────────────────────────────────────

describe("integration — controlled value", () => {
  it("accepts and switches between controlled values without crash", () => {
    const emptyState = JSON.stringify({
      root: {
        children: [
          {
            children: [],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    });

    expect(() => {
      const { rerender, unmount } = render(
        <LexiwindEditor namespace="smoke-controlled" value={emptyState} />
      );
      rerender(<LexiwindEditor namespace="smoke-controlled" value={emptyState} />);
      unmount();
    }).not.toThrow();
  });
});

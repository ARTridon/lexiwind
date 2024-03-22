import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LexiwindEditor } from "@lexiwind/react";

// ─── @lexiwind/history ────────────────────────────────────────────────────────

import {
  HistoryPlugin,
  useHistory,
  createEmptyHistoryState,
} from "@lexiwind/history";

describe("@lexiwind/history — exports", () => {
  it("HistoryPlugin is a function", () => {
    expect(typeof HistoryPlugin).toBe("function");
  });

  it("useHistory hook is a function", () => {
    expect(typeof useHistory).toBe("function");
  });

  it("createEmptyHistoryState returns a non-null object", () => {
    const state = createEmptyHistoryState();
    expect(state).toBeDefined();
    expect(typeof state).toBe("object");
    expect(state).not.toBeNull();
  });

  it("HistoryPlugin mounts inside LexiwindEditor without crash", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor>
          <HistoryPlugin />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── @lexiwind/toolbar ────────────────────────────────────────────────────────

import { ToolbarPlugin, useToolbar, ToolbarContext } from "@lexiwind/toolbar";

describe("@lexiwind/toolbar — exports", () => {
  it("ToolbarPlugin is a function", () => {
    expect(typeof ToolbarPlugin).toBe("function");
  });

  it("useToolbar hook is a function", () => {
    expect(typeof useToolbar).toBe("function");
  });

  it("ToolbarContext is a React context object", () => {
    expect(ToolbarContext).toBeDefined();
    expect(typeof ToolbarContext).toBe("object");
  });

  it("ToolbarPlugin mounts inside LexiwindEditor without crash", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor>
          <ToolbarPlugin>
            <span data-testid="toolbar-child" />
          </ToolbarPlugin>
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── @lexiwind/slash-command ──────────────────────────────────────────────────

import {
  SlashCommandPlugin,
  SlashCommandRegistryProvider,
  useSlashCommandRegistry,
  useRegisterSlashCommands,
  defaultCommands,
} from "@lexiwind/slash-command";

describe("@lexiwind/slash-command — exports", () => {
  it("SlashCommandPlugin is a function", () => {
    expect(typeof SlashCommandPlugin).toBe("function");
  });

  it("SlashCommandRegistryProvider is a function", () => {
    expect(typeof SlashCommandRegistryProvider).toBe("function");
  });

  it("useSlashCommandRegistry is a function", () => {
    expect(typeof useSlashCommandRegistry).toBe("function");
  });

  it("useRegisterSlashCommands is a function", () => {
    expect(typeof useRegisterSlashCommands).toBe("function");
  });

  it("defaultCommands factory returns a non-empty array", () => {
    const mockEditor = {
      update: () => {},
      dispatchCommand: () => {},
    } as unknown as Parameters<typeof defaultCommands>[0];

    const commands = defaultCommands(mockEditor);
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
  });

  it("each default command has required fields", () => {
    const mockEditor = {
      update: () => {},
      dispatchCommand: () => {},
    } as unknown as Parameters<typeof defaultCommands>[0];

    for (const cmd of defaultCommands(mockEditor)) {
      expect(typeof cmd.id).toBe("string");
      expect(cmd.id.length).toBeGreaterThan(0);
      expect(typeof cmd.title).toBe("string");
      expect(Array.isArray(cmd.keywords)).toBe(true);
      expect(typeof cmd.onSelect).toBe("function");
    }
  });
});

// ─── @lexiwind/mentions ───────────────────────────────────────────────────────

import {
  createMentionsPlugin,
  MentionNode,
  $createMentionNode,
  $isMentionNode,
} from "@lexiwind/mentions";

describe("@lexiwind/mentions — exports", () => {
  it("createMentionsPlugin is a function", () => {
    expect(typeof createMentionsPlugin).toBe("function");
  });

  it("createMentionsPlugin returns a component function", () => {
    const Plugin = createMentionsPlugin({ onSearch: async () => [] });
    expect(typeof Plugin).toBe("function");
  });

  it("MentionNode is a class (function)", () => {
    expect(typeof MentionNode).toBe("function");
  });

  it("$createMentionNode is a function", () => {
    expect(typeof $createMentionNode).toBe("function");
  });

  it("$isMentionNode is a function", () => {
    expect(typeof $isMentionNode).toBe("function");
  });

  it("MentionNode registers with type 'mention'", () => {
    expect(MentionNode.getType()).toBe("mention");
  });

  it("createMentionsPlugin mounts inside LexiwindEditor with MentionNode registered", () => {
    const MentionsPlugin = createMentionsPlugin({ onSearch: async () => [] });
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor config={{ nodes: [MentionNode] }}>
          <MentionsPlugin />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── @lexiwind/embeds ─────────────────────────────────────────────────────────

import {
  EmbedPlugin,
  createEmbedPlugin,
  INSERT_EMBED_COMMAND,
  EmbedNode,
  $createEmbedNode,
  $isEmbedNode,
  youtubeMatcher,
  twitterMatcher,
  figmaMatcher,
  defaultMatchers,
} from "@lexiwind/embeds";

describe("@lexiwind/embeds — exports", () => {
  it("EmbedPlugin is a function", () => {
    expect(typeof EmbedPlugin).toBe("function");
  });

  it("createEmbedPlugin returns a component function", () => {
    const Plugin = createEmbedPlugin({ matchers: [] });
    expect(typeof Plugin).toBe("function");
  });

  it("INSERT_EMBED_COMMAND is defined", () => {
    expect(INSERT_EMBED_COMMAND).toBeDefined();
  });

  it("EmbedNode is a class with type 'embed'", () => {
    expect(typeof EmbedNode).toBe("function");
    expect(EmbedNode.getType()).toBe("embed");
  });

  it("$createEmbedNode and $isEmbedNode are functions", () => {
    expect(typeof $createEmbedNode).toBe("function");
    expect(typeof $isEmbedNode).toBe("function");
  });

  it("defaultMatchers is a non-empty array", () => {
    expect(Array.isArray(defaultMatchers)).toBe(true);
    expect(defaultMatchers.length).toBeGreaterThan(0);
  });

  it("youtubeMatcher resolves a standard watch URL", () => {
    const result = youtubeMatcher.resolve("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(result).not.toBeNull();
    expect(result?.type).toBe("youtube");
    expect((result as Record<string, unknown>)["videoId"]).toBe("dQw4w9WgXcQ");
    expect(result?.embedUrl).toContain("dQw4w9WgXcQ");
  });

  it("youtubeMatcher resolves a youtu.be short URL", () => {
    const result = youtubeMatcher.resolve("https://youtu.be/dQw4w9WgXcQ");
    expect(result).not.toBeNull();
    expect((result as Record<string, unknown>)["videoId"]).toBe("dQw4w9WgXcQ");
  });

  it("youtubeMatcher returns null for a non-matching URL", () => {
    expect(youtubeMatcher.resolve("https://vimeo.com/123456")).toBeNull();
  });

  it("twitterMatcher resolves a tweet URL", () => {
    const result = twitterMatcher.resolve("https://twitter.com/user/status/123456789");
    expect(result).not.toBeNull();
    expect(result?.type).toBe("twitter");
  });

  it("figmaMatcher resolves a Figma file URL", () => {
    const result = figmaMatcher.resolve("https://figma.com/file/abc/My-Design");
    expect(result).not.toBeNull();
    expect(result?.type).toBe("figma");
    expect(result?.embedUrl).toContain("figma.com/embed");
  });

  it("EmbedPlugin mounts inside LexiwindEditor with EmbedNode registered", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor config={{ nodes: [EmbedNode] }}>
          <EmbedPlugin matchers={[]} autoPaste={false} />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

// ─── @lexiwind/collapsible ────────────────────────────────────────────────────

import {
  CollapsiblePlugin,
  INSERT_COLLAPSIBLE_COMMAND,
  CollapsibleContainerNode,
  CollapsibleTitleNode,
  CollapsibleContentNode,
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
} from "@lexiwind/collapsible";

describe("@lexiwind/collapsible — exports", () => {
  it("CollapsiblePlugin is a function", () => {
    expect(typeof CollapsiblePlugin).toBe("function");
  });

  it("INSERT_COLLAPSIBLE_COMMAND is defined", () => {
    expect(INSERT_COLLAPSIBLE_COMMAND).toBeDefined();
  });

  it("node classes are exported as functions", () => {
    expect(typeof CollapsibleContainerNode).toBe("function");
    expect(typeof CollapsibleTitleNode).toBe("function");
    expect(typeof CollapsibleContentNode).toBe("function");
  });

  it("$createCollapsibleContainerNode is a function", () => {
    expect(typeof $createCollapsibleContainerNode).toBe("function");
  });

  it("$isCollapsibleContainerNode is a function", () => {
    expect(typeof $isCollapsibleContainerNode).toBe("function");
  });

  it("CollapsiblePlugin mounts inside LexiwindEditor with required nodes registered", () => {
    expect(() => {
      const { unmount } = render(
        <LexiwindEditor
          config={{
            nodes: [CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
          }}
        >
          <CollapsiblePlugin />
        </LexiwindEditor>
      );
      unmount();
    }).not.toThrow();
  });
});

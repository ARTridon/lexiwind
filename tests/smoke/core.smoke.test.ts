import { describe, expect, it } from "vitest";
import * as core from "@lexiwind/core";

describe("@lexiwind/core — module integrity", () => {
  it("imports without crash", () => {
    expect(core).toBeDefined();
  });

  it("isLazyPlugin is exported as a function", () => {
    expect(typeof core.isLazyPlugin).toBe("function");
  });

  it("isLazyPlugin returns false for a plain plugin object", () => {
    const plugin: core.LexiwindPlugin = {
      id: "smoke:test",
      version: "1.0.0",
      displayName: "Smoke Test Plugin",
    };
    expect(core.isLazyPlugin(plugin)).toBe(false);
  });

  it("isLazyPlugin returns true for an object with a load() function", () => {
    const lazy: core.LazyPlugin = {
      id: "smoke:lazy",
      version: "1.0.0",
      displayName: "Lazy Plugin",
      load: async () => ({
        default: { id: "smoke:lazy", version: "1.0.0", displayName: "Lazy Plugin" },
      }),
    };
    expect(core.isLazyPlugin(lazy)).toBe(true);
  });
});

describe("@lexiwind/core — plugin contract shape", () => {
  it("a minimal LexiwindPlugin satisfies the interface", () => {
    const plugin: core.LexiwindPlugin = {
      id: "smoke:minimal",
      version: "0.1.0",
      displayName: "Minimal Plugin",
    };
    expect(plugin.id).toBe("smoke:minimal");
    expect(plugin.version).toBe("0.1.0");
    expect(plugin.displayName).toBe("Minimal Plugin");
  });

  it("a full-featured plugin can carry all optional fields", () => {
    const plugin: core.LexiwindPlugin = {
      id: "smoke:full",
      version: "1.0.0",
      displayName: "Full Plugin",
      description: "Smoke test",
      dependencies: ["smoke:minimal"],
      commands: [],
      shortcuts: [],
      toolbarItems: [],
      serializers: [],
      api: { ping: () => "pong" },
    };
    expect(plugin.commands).toHaveLength(0);
    expect(plugin.dependencies).toContain("smoke:minimal");
    expect((plugin.api as Record<string, unknown>)["ping"]).toBeTypeOf("function");
  });
});

describe("@lexiwind/core — embed matchers shape", () => {
  it("EmbedMatcher type accepts a valid matcher literal", () => {
    const matcher: core.EmbedMatcher = {
      type: "smoke",
      patterns: [/^https:\/\/smoke\.test\//],
      resolve: (url) => ({ type: "smoke", url, embedUrl: url }),
    };
    const result = matcher.resolve("https://smoke.test/video");
    expect(result).not.toBeNull();
    expect(result?.type).toBe("smoke");
    expect(result?.url).toBe("https://smoke.test/video");
  });
});

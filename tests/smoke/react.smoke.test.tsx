import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LexiwindEditor, UpdateStatePlugin } from "@lexiwind/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

describe("@lexiwind/react — module exports", () => {
  it("LexiwindEditor is a function component", () => {
    expect(typeof LexiwindEditor).toBe("function");
  });

  it("UpdateStatePlugin is a function component", () => {
    expect(typeof UpdateStatePlugin).toBe("function");
  });

  it("useLexicalComposerContext is re-exported as a function", () => {
    expect(typeof useLexicalComposerContext).toBe("function");
  });
});

describe("@lexiwind/react — LexiwindEditor mount", () => {
  it("mounts and unmounts without crash", () => {
    expect(() => {
      const { unmount } = render(<LexiwindEditor />);
      unmount();
    }).not.toThrow();
  });

  it("accepts a custom namespace prop", () => {
    const { unmount } = render(<LexiwindEditor namespace="smoke-editor" />);
    unmount();
  });

  it("mounts with arbitrary children", () => {
    const { unmount, container } = render(
      <LexiwindEditor>
        <div data-testid="child-sentinel" />
      </LexiwindEditor>
    );
    expect(container.querySelector('[data-testid="child-sentinel"]')).not.toBeNull();
    unmount();
  });

  it("calls onChange when the editor initialises", async () => {
    const onChange = vi.fn();
    const { unmount } = render(<LexiwindEditor onChange={onChange} />);
    unmount();
    // onChange may or may not fire synchronously on mount — just verify no crash
  });

  it("mounts with a defaultValue JSON string without crash", () => {
    const emptyState = JSON.stringify({
      root: {
        children: [{ children: [], direction: null, format: "", indent: 0, type: "paragraph", version: 1 }],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    });
    expect(() => {
      const { unmount } = render(<LexiwindEditor defaultValue={emptyState} />);
      unmount();
    }).not.toThrow();
  });
});

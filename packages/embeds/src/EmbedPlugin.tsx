"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_EDITOR,
  PASTE_COMMAND,
  createCommand,
  type LexicalCommand,
} from "lexical";
import {
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import type { EmbedMatcher, EmbedPayload } from "@lexiwind/core";
import {
  $createEmbedNode,
  EmbedNode,
} from './EmbedNode';
import { defaultMatchers } from './matchers';

// ─── Commands ─────────────────────────────────────────────────────────────────

export const INSERT_EMBED_COMMAND: LexicalCommand<EmbedPayload> =
  createCommand("INSERT_EMBED_COMMAND");

// ─── Default renderers ────────────────────────────────────────────────────────

function YouTubeEmbed({ payload }: { payload: EmbedPayload }) {
  return (
    <div className="relative my-4 overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={payload.embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`YouTube embed ${payload.videoId ?? ""}`}
      />
    </div>
  );
}

function TwitterEmbed({ payload }: { payload: EmbedPayload }) {
  return (
    <div className="my-4 flex justify-center">
      <blockquote className="twitter-tweet">
        <a href={payload.url}>{payload.url}</a>
      </blockquote>
    </div>
  );
}

function FigmaEmbed({ payload }: { payload: EmbedPayload }) {
  return (
    <div className="relative my-4 overflow-hidden rounded-lg border border-gray-200" style={{ height: "450px" }}>
      <iframe
        className="h-full w-full"
        src={payload.embedUrl}
        allowFullScreen
        title="Figma embed"
      />
    </div>
  );
}

function GenericEmbed({ payload }: { payload: EmbedPayload }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-gray-200">
      <iframe
        className="h-64 w-full"
        src={payload.embedUrl}
        allowFullScreen
        title={`${payload.type} embed`}
      />
    </div>
  );
}

function defaultRenderEmbed(payload: EmbedPayload): ReactNode {
  switch (payload.type) {
    case "youtube": return <YouTubeEmbed payload={payload} />;
    case "twitter": return <TwitterEmbed payload={payload} />;
    case "figma":   return <FigmaEmbed payload={payload} />;
    default:        return <GenericEmbed payload={payload} />;
  }
}

// ─── EmbedRenderer component ──────────────────────────────────────────────────

function EmbedRenderer({
  nodeKey,
  payload,
  renderEmbed,
}: {
  nodeKey: string;
  payload: EmbedPayload;
  renderEmbed(payload: EmbedPayload): ReactNode;
}) {
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  return (
    <div
      className={[
        "relative rounded-lg outline-2 outline-offset-2 transition-colors",
        isSelected ? "outline outline-blue-500" : "outline-transparent",
      ].join(" ")}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) { clearSelection(); setSelected(true); }
      }}
    >
      {renderEmbed(payload)}
    </div>
  );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export interface EmbedPluginOptions {
  /**
   * URL matchers to enable. Defaults to [youtubeMatcher, twitterMatcher, figmaMatcher].
   * Pass a subset to disable services, or add your own matchers for custom embed types.
   *
   * @example
   * ```ts
   * // YouTube + Spotify only
   * matchers: [youtubeMatcher, spotifyMatcher]
   * ```
   */
  matchers?: EmbedMatcher[];

  /**
   * Override the embed renderer for any or all embed types.
   * Return null to fall through to the default renderer.
   *
   * @example
   * ```tsx
   * renderEmbed: (payload) => {
   *   if (payload.type === "youtube") return <MyYouTubePlayer {...payload} />;
   *   return null; // use default for all others
   * }
   * ```
   */
  renderEmbed?(payload: EmbedPayload): ReactNode | null;

  /**
   * Whether to intercept paste events and automatically convert matching URLs.
   * Default: true.
   */
  autoPaste?: boolean;
}

/**
 * Unified embed plugin. Handles YouTube, Twitter, Figma, and any custom
 * embed type defined by an EmbedMatcher.
 *
 * Register EmbedNode in your editor config before using this plugin:
 * ```ts
 * nodes: [EmbedNode, ...otherNodes]
 * ```
 *
 * @example
 * ```tsx
 * // All defaults:
 * <EmbedPlugin />
 *
 * // YouTube only with custom renderer:
 * <EmbedPlugin
 *   matchers={[youtubeMatcher]}
 *   renderEmbed={(p) => <MyPlayer videoId={p.videoId} />}
 * />
 *
 * // Custom embed type:
 * <EmbedPlugin matchers={[...defaultMatchers, spotifyMatcher]} />
 * ```
 */
export function EmbedPlugin({
  matchers = defaultMatchers,
  renderEmbed: customRenderer,
  autoPaste = true,
}: EmbedPluginOptions = {}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EmbedNode])) {
      throw new Error(
        "EmbedPlugin: EmbedNode is not registered. Add it to your editor config.nodes."
      );
    }
  }, [editor]);

  const resolveUrl = useCallback(
    (url: string): EmbedPayload | null => {
      for (const matcher of matchers) {
        if (matcher.patterns.some((p) => p.test(url))) {
          const payload = matcher.resolve(url);
          if (payload) return payload;
        }
      }
      return null;
    },
    [matchers]
  );

  const render = useCallback(
    (payload: EmbedPayload): ReactNode => {
      const custom = customRenderer?.(payload);
      return custom ?? defaultRenderEmbed(payload);
    },
    [customRenderer]
  );

  useEffect(() => {
    return mergeRegister(
      // INSERT_EMBED_COMMAND — programmatic insertion
      editor.registerCommand(
        INSERT_EMBED_COMMAND,
        (payload) => {
          const node = $createEmbedNode(payload);
          $insertNodeToNearestRoot(node);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),

      // Decorate existing EmbedNodes
      editor.registerDecoratorListener<ReactNode>((_decorators) => {
        // decorators map is updated by registerDecoratorListener — no action needed
        // The decorate() method on EmbedNode is overridden below
      }),

      // Intercept paste to auto-embed matching URLs
      ...(autoPaste
        ? [
            editor.registerCommand(
              PASTE_COMMAND,
              (event) => {
                const clipboardEvent = event as ClipboardEvent;
                const text = clipboardEvent.clipboardData
                  ?.getData("text/plain")
                  ?.trim();
                if (!text) return false;

                const payload = resolveUrl(text);
                if (!payload) return false;

                editor.dispatchCommand(INSERT_EMBED_COMMAND, payload);
                clipboardEvent.preventDefault();
                return true;
              },
              COMMAND_PRIORITY_EDITOR
            ),
          ]
        : [])
    );
  }, [editor, resolveUrl, autoPaste]);

  // Register the decorator renderer by monkey-patching EmbedNode.decorate
  // This is the standard Lexical pattern for DecoratorNodes that need
  // runtime-configured rendering (avoids storing React components in node state)
  useEffect(() => {
    const originalDecorate = EmbedNode.prototype.decorate;
    EmbedNode.prototype.decorate = function (_editor, _config) {
      return (
        <EmbedRenderer
          nodeKey={this.getKey()}
          payload={this.getPayload()}
          renderEmbed={render}
        />
      );
    };
    return () => {
      EmbedNode.prototype.decorate = originalDecorate;
    };
  }, [render]);

  return null;
}

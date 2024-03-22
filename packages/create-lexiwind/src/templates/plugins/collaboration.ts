import type { Framework } from '../../utils/detect';

export function generateCollaborationTsx(opts: { framework: Framework }): string {
  const useClient = opts.framework === "nextjs-app";
  const directive = useClient ? '"use client";\n\n' : "";

  return `${directive}import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { useCallback } from "react";

const doc = new Y.Doc();

/**
 * Real-time collaborative editing via Yjs + WebSocket.
 *
 * Replace the WebSocket URL and room name with your own server.
 * See https://github.com/yjs/y-websocket for self-hosting options.
 *
 * Place inside <Lexiwind> (NOT the default <Lexiwind> wrapper — use a
 * custom LexicalComposer with CollaborationPlugin as a sibling to RichTextPlugin).
 */
export function LexiwindCollaborationPlugin() {
  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const sharedDoc = doc;
      yjsDocMap.set(id, sharedDoc);

      const provider = new WebsocketProvider(
        "wss://your-websocket-server.example.com",
        id,
        sharedDoc,
        { connect: false }
      );

      return provider;
    },
    []
  );

  return (
    <CollaborationPlugin
      id="lexiwind-collab-room"
      providerFactory={providerFactory}
      shouldBootstrap
    />
  );
}
`;
}

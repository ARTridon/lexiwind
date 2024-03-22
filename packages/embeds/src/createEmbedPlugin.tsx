import { EmbedPlugin, type EmbedPluginOptions } from './EmbedPlugin';

/**
 * Factory that returns a pre-configured EmbedPlugin component.
 * Prefer this when you want to lock in matchers/renderer at module scope
 * rather than re-computing them on every render.
 *
 * @example
 * ```tsx
 * const MyEmbedPlugin = createEmbedPlugin({
 *   matchers: [youtubeMatcher, spotifyMatcher],
 *   renderEmbed: (p) => p.type === "spotify" ? <SpotifyPlayer {...p} /> : null,
 * });
 * ```
 */
export function createEmbedPlugin(options: EmbedPluginOptions) {
  return function BoundEmbedPlugin() {
    return <EmbedPlugin {...options} />;
  };
}

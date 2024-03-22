import type { EmbedMatcher, EmbedPayload } from "@lexiwind/core";

// ─── YouTube ──────────────────────────────────────────────────────────────────

export const youtubeMatcher: EmbedMatcher = {
  type: "youtube",
  patterns: [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?.*v=([\w-]+)/,
    /^https?:\/\/youtu\.be\/([\w-]+)/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/([\w-]+)/,
  ],
  resolve(url): EmbedPayload | null {
    let videoId: string | null = null;

    const watchMatch = url.match(/[?&]v=([\w-]+)/);
    if (watchMatch) videoId = watchMatch[1];

    if (!videoId) {
      const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
      if (shortMatch) videoId = shortMatch[1];
    }

    if (!videoId) {
      const shortsMatch = url.match(/\/shorts\/([\w-]+)/);
      if (shortsMatch) videoId = shortsMatch[1];
    }

    if (!videoId) return null;

    return {
      type: "youtube",
      url,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      videoId,
    };
  },
};

// ─── Twitter / X ──────────────────────────────────────────────────────────────

export const twitterMatcher: EmbedMatcher = {
  type: "twitter",
  patterns: [
    /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/(\d+)/,
  ],
  resolve(url): EmbedPayload | null {
    const m = url.match(/(?:twitter|x)\.com\/(\w+)\/status\/(\d+)/);
    if (!m) return null;
    return {
      type: "twitter",
      url,
      embedUrl: url,
      username: m[1],
      tweetId: m[2],
    };
  },
};

// ─── Figma ────────────────────────────────────────────────────────────────────

export const figmaMatcher: EmbedMatcher = {
  type: "figma",
  patterns: [
    /^https:\/\/(www\.)?figma\.com\/(file|proto|design)\//,
  ],
  resolve(url): EmbedPayload | null {
    if (!/figma\.com\/(file|proto|design)\//.test(url)) return null;
    const embedUrl = `https://www.figma.com/embed?embed_host=lexiwind&url=${encodeURIComponent(url)}`;
    return { type: "figma", url, embedUrl };
  },
};

// ─── Default set ──────────────────────────────────────────────────────────────

/** All built-in matchers. Pass a subset to createEmbedPlugin to disable services. */
export const defaultMatchers: EmbedMatcher[] = [
  youtubeMatcher,
  twitterMatcher,
  figmaMatcher,
];

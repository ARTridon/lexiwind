export interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    border: string;
    input: string;
    ring: string;
    muted: {
      background: string;
      foreground: string;
    };
    destructive: {
      background: string;
      foreground: string;
      border: string;
    };
    accent: {
      background: string;
      foreground: string;
    };
  };
  editor: {
    background: string;
    foreground: string;
    border: string;
    selection: string;
  };
}

export const LIGHT_THEME: ThemeConfig = {
  colors: {
    background: "#ffffff",
    foreground: "#0f172a",
    border: "#e2e8f0",
    input: "#f1f5f9",
    ring: "#3b82f6",
    muted: {
      background: "#f1f5f9",
      foreground: "#64748b",
    },
    destructive: {
      background: "#ef4444",
      foreground: "#ffffff",
      border: "#fca5a5",
    },
    accent: {
      background: "#3b82f6",
      foreground: "#ffffff",
    },
  },
  editor: {
    background: "#ffffff",
    foreground: "#1e293b",
    border: "#e2e8f0",
    selection: "#dbeafe",
  },
};

export const DARK_THEME: ThemeConfig = {
  colors: {
    background: "#0f172a",
    foreground: "#f1f5f9",
    border: "#1e293b",
    input: "#1e293b",
    ring: "#60a5fa",
    muted: {
      background: "#1e293b",
      foreground: "#94a3b8",
    },
    destructive: {
      background: "#7f1d1d",
      foreground: "#fecaca",
      border: "#991b1b",
    },
    accent: {
      background: "#3b82f6",
      foreground: "#0f172a",
    },
  },
  editor: {
    background: "#1e293b",
    foreground: "#f1f5f9",
    border: "#334155",
    selection: "#1e3a8a",
  },
};

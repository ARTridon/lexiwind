import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

/** Dependencies that are not bundled; consumer must install them (see peerDependencies). */
const peerDeps = [
  'react',
  'react-dom',
  'lexical',
  '@lexical/code',
  '@lexical/hashtag',
  '@lexical/link',
  '@lexical/list',
  '@lexical/markdown',
  '@lexical/overflow',
  '@lexical/react',
  '@lexical/rich-text',
  '@lexical/selection',
  '@lexical/table',
  '@lexical/utils',
  '@radix-ui/react-select',
  '@radix-ui/react-slot',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@excalidraw/excalidraw',
  'katex',
];

const umdGlobals: Record<string, string> = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lexical: 'Lexical',
  '@lexical/code': 'LexicalCode',
  '@lexical/hashtag': 'LexicalHashtag',
  '@lexical/link': 'LexicalLink',
  '@lexical/list': 'LexicalList',
  '@lexical/markdown': 'LexicalMarkdown',
  '@lexical/overflow': 'LexicalOverflow',
  '@lexical/react': 'LexicalReact',
  '@lexical/rich-text': 'LexicalRichText',
  '@lexical/selection': 'LexicalSelection',
  '@lexical/table': 'LexicalTable',
  '@lexical/utils': 'LexicalUtils',
  '@radix-ui/react-select': 'RadixSelect',
  '@radix-ui/react-slot': 'RadixSlot',
  'class-variance-authority': 'cva',
  clsx: 'clsx',
  'tailwind-merge': 'tailwindMerge',
  '@excalidraw/excalidraw': 'ExcalidrawLib',
  katex: 'katex',
};

export default defineConfig({
  plugins: [
    libInjectCss(),
    dts({
      rollupTypes: true,
    }),
    tsConfigPaths(),
    react(),
  ],
  build: {
    lib: {
      entry: path.resolve('src', 'index.ts'),
      name: 'lexiwind',
      fileName: (format: string) => `index.${format}.js`,
    },
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: (id: string) => {
        if (peerDeps.includes(id)) return true;
        return peerDeps.some((p: string) => id === p || id.startsWith(`${p}/`));
      },
      output: {
        globals: umdGlobals,
        compact: true,
        generatedCode: { constBindings: true },
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

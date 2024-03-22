import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/Editor.tsx'],
    }),
    react(),
    tsConfigPaths(),
    react(),
  ],
  build: {
    lib: {
      entry: path.resolve('src', 'Editor.tsx'),
      name: 'lexiwind',
      fileName: (format) => `lexiwind.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});

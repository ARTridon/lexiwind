import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/Lexiwind.tsx'],
    }),
    tsConfigPaths(),
    react(),
  ],
  build: {
    lib: {
      entry: path.resolve('src', 'Lexiwind.tsx'),
      name: 'lexiwind',
      fileName: (format) => `lexiwind.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

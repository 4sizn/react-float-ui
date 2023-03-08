import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
const __dirname = resolve();

export default defineConfig((configEnv) => ({
  plugins: [react(), dts()],
  build: {
    lib: {
      name: 'reactFloatUI',
      fileName: 'react-float-ui',
      formats: ['es', 'cjs', 'umd', 'iife'],
      entry: resolve(__dirname, 'src/index.ts'),
    },
  },
}));

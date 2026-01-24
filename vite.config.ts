import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@stores': path.resolve(__dirname, './src/application/stores'),
      '@utils': path.resolve(__dirname, './src/core/utils'),
      '@assets': path.resolve(__dirname, './src/core/assets'),
      '@hooks': path.resolve(__dirname, './src/application/hooks'),
      '@type': path.resolve(__dirname, './src/core/types'),
      '@services': path.resolve(__dirname, './src/data/services'),
      '@repositories': path.resolve(__dirname, './src/data/repositories'),
      '@adapters': path.resolve(__dirname, './src/data/adapters'),
      '@validation': path.resolve(__dirname, './src/core/validation'),
      '@data': path.resolve(__dirname, './src/data'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@application': path.resolve(__dirname, './src/application'),
      '@customdash/ui': path.resolve(__dirname, './packages/ui/src'),
      '@customdash/visualizations': path.resolve(__dirname, './packages/visualizations/src'),
      '@customdash/utils': path.resolve(__dirname, './packages/utils/src'),
    },
  },
});

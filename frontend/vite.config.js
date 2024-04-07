import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
  },
  optimizeDeps: {
    include: ['mapbox-gl', '@studiometa/vue-mapbox-gl'],
  },
  define: {
    'process.env': process.env,
  },
});

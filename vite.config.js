import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Find all HTML files in the root directory
const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

// Create an input object for Rollup
const input = {};
htmlFiles.forEach(file => {
  const name = file.split('.')[0];
  input[name] = resolve(__dirname, file);
});

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input
    }
  }
});

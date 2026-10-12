import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Width and height of a PNG, JPEG or WebP, read from its header
function readImageSize(buf) {
  // PNG: IHDR right after the signature
  if (buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  // WebP: lossy (VP8), lossless (VP8L) or extended (VP8X)
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
    }
    if (chunk === 'VP8X') return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  }
  // JPEG: the first start-of-frame marker
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      }
      i += 2 + len;
    }
  }
  return null;
}

// `import size from './shot.webp?size'` gives [width, height], so a frame can take the image's
// exact shape before the image itself has loaded (used by src/data/projectScreens.js)
function imageSizes() {
  return {
    name: 'image-sizes',
    enforce: 'pre',
    load(id) {
      const [file, query] = id.split('?');
      if (query !== 'size') return null;
      const size = readImageSize(readFileSync(file));
      return `export default ${JSON.stringify(size)};`;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [imageSizes(), react()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animation: ['gsap', 'lenis'],
          icons: ['lucide-react']
        }
      }
    }
  }
});

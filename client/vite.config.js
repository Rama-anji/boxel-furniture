import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development the Vite server proxies API, upload, sitemap and robots requests
// to Express, so the browser talks to a single origin and cookies just work.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_PROXY || 'http://localhost:5000';
  let lastWarn = 0;
  const proxied = {
    target,
    changeOrigin: false,
    // When the API is down, answer with a clear message instead of a stack trace per request.
    configure: (proxy) => {
      proxy.on('error', (err, _req, res) => {
        if (Date.now() - lastWarn > 10_000) {
          lastWarn = Date.now();
          console.warn(`\n  [boxel] The API at ${target} is not running (${err.code || 'connection refused'}).\n  [boxel] Start everything with "npm run dev" in the project folder, and make sure MySQL is started in XAMPP.\n`);
        }
        if (res && !res.headersSent && typeof res.writeHead === 'function') {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'The store server is not running. Start it with "npm run dev" and start MySQL in XAMPP.' }));
        }
      });
    },
  };
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': proxied,
        '/uploads': proxied,
        '/sitemap.xml': proxied,
        '/robots.txt': proxied,
      },
    },
    preview: { port: 4173 },
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 600,
    },
  };
});

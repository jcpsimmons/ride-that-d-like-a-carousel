import { serve } from 'bun';
import chokidar from 'chokidar';
import { readFileSync } from 'fs';
import { join } from 'path';
import { WebSocketServer } from 'ws';
import { generateSlideHtml } from './template';
import type { CarouselConfig } from './types';

const configPath = join(process.cwd(), 'src/slides.json');
let currentConfig: CarouselConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

// Live reload WebSocket server
const wss = new WebSocketServer({ port: 35729 });
function broadcastReload() {
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) client.send('reload');
  });
}

// Watch for changes in SCSS, config, or template
chokidar.watch([
  join(process.cwd(), 'src/template.scss'),
  join(process.cwd(), 'src/template.ts'),
  configPath,
  join(process.cwd(), 'src/types.ts'),
]).on('change', (path) => {
  if (path === configPath) {
    currentConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  }
  delete require.cache[require.resolve('./template')];
  broadcastReload();
});

// Live reload script to inject
const liveReloadScript = `
<script>
  const ws = new WebSocket('ws://localhost:35729');
  ws.onmessage = (msg) => { if (msg.data === 'reload') location.reload(); };
</script>
`;

// Serve slides and navigation
serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/') {
      // Navigation UI
      const nav = Array.from({ length: currentConfig.slides.length }, (_, i) => `<a href="/slide/${i}">Slide ${i + 1}</a>`).join(' | ');
      return new Response(`
        <html><body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;">
        <h1>Carousel Preview</h1>
        <div>${nav}</div>
        <p>Edit your config or SCSS and the preview will auto-reload.</p>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }
    const match = url.pathname.match(/^\/slide\/(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (idx >= 0 && idx < currentConfig.slides.length) {
        const html = generateSlideHtml(currentConfig.slides[idx], currentConfig, { previewMode: true }).replace('</body>', `${liveReloadScript}</body>`);
        return new Response(html, { headers: { 'Content-Type': 'text/html' } });
      }
    }
    return new Response('Not found', { status: 404 });
  }
});

console.log('Preview server running at http://localhost:3000');
console.log('Live reload enabled. Edit your files and the browser will update.'); 

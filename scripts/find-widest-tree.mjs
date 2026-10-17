import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3336;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(OUT_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  else if (fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function run() {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  try {
    const res = await fetch('http://127.0.0.1:9227/json/new', { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = msgId++;
      const onMsg = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', onMsg);
          resolve(msg);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 600, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?skipIntro=1` });
    await new Promise(r => setTimeout(r, 800));

    // At 100% zoom:
    const normal = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          innerW: window.innerWidth,
          docScrollW: document.documentElement.scrollWidth,
          bodyScrollW: document.body.scrollWidth,
          children: Array.from(document.body.children).map(c => ({
            tag: c.tagName,
            id: c.id,
            scrollW: c.scrollWidth,
            offsetW: c.offsetWidth,
            clientW: c.clientWidth
          }))
        };
      })()`,
      returnByValue: true
    });
    console.log('Normal (100%):', JSON.stringify(normal.result.result.value, null, 2));

    // At 200% zoom:
    await send('Runtime.evaluate', { expression: "document.documentElement.style.fontSize = '200%';" });
    await new Promise(r => setTimeout(r, 600));

    const zoomed = await send('Runtime.evaluate', {
      expression: `(() => {
        // Find which child of body has scrollWidth > 320
        function findWidest(el, depth = 0) {
          if (!el || depth > 8) return null;
          const kids = Array.from(el.children).filter(c => c.scrollWidth > 320 || c.offsetWidth > 320);
          return {
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className : '',
            scrollW: el.scrollWidth,
            offsetW: el.offsetWidth,
            kids: kids.map(k => findWidest(k, depth + 1))
          };
        }
        return {
          innerW: window.innerWidth,
          docScrollW: document.documentElement.scrollWidth,
          bodyScrollW: document.body.scrollWidth,
          bodyTree: findWidest(document.body)
        };
      })()`,
      returnByValue: true
    });
    console.log('Zoomed (200%):', JSON.stringify(zoomed.result.result.value, null, 2));

    chrome.kill();
    server.close();
  } catch (e) {
    console.error(e);
    chrome.kill();
    server.close();
  }
}
run();

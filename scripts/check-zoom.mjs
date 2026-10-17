import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3335;
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
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }
  let filePath = path.join(OUT_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFound = path.join(OUT_DIR, '404.html');
    if (fs.existsSync(notFound)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFound).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function run() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch('http://127.0.0.1:9226/json/new', { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    let msgId = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 600,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/?skipIntro=1` });
    await new Promise((r) => setTimeout(r, 800));

    // Increase font size to simulate 200% zoom
    await send('Runtime.evaluate', { expression: "document.documentElement.style.fontSize = '200%';" });
    await new Promise((r) => setTimeout(r, 600));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const innerW = window.innerWidth;
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.filter(el => {
          if (['SCRIPT','STYLE','META','HEAD','TITLE','LINK'].includes(el.tagName)) return false;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return false;
          if (r.right < 0 || r.left <= -500) return false;
          return r.width > innerW + 1 || r.right > innerW + 1;
        }).map(el => ({
          tag: el.tagName,
          id: el.id,
          class: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : '',
          w: Math.round(el.getBoundingClientRect().width),
          r: Math.round(el.getBoundingClientRect().right),
          text: (el.innerText || '').slice(0, 30).replace(/\\n/g, ' ')
        }));
      })()`,
      returnByValue: true
    });

    console.log('Offending at 200% zoom on /:', JSON.stringify(check.result.result.value, null, 2));

    chrome.kill();
    server.close();
  } catch (e) {
    console.error(e);
    chrome.kill();
    server.close();
  }
}

run();

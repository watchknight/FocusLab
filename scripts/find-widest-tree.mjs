import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3337;
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
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-sandbox'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  try {
    const res = await fetch('http://127.0.0.1:9228/json/new', { method: 'PUT' });
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

    // Increase font size to simulate 200% zoom
    await send('Runtime.evaluate', { expression: "document.documentElement.style.fontSize = '200%';" });
    await new Promise(r => setTimeout(r, 600));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const topKids = Array.from(document.body.children).map(c => ({
          tag: c.tagName,
          id: c.id,
          class: (c.className && typeof c.className === 'string') ? c.className.split(' ').slice(0, 2).join(' ') : '',
          scrollW: c.scrollWidth,
          offsetW: c.offsetWidth,
          clientW: c.clientWidth
        }));

        function getLeafOffenders(root) {
          const list = [];
          function walk(el) {
            const hasWideChild = Array.from(el.children).some(c => c.scrollWidth > 320 || c.offsetWidth > 320 || c.getBoundingClientRect().right > 320);
            if (!hasWideChild && (el.scrollWidth > 320 || el.offsetWidth > 320 || el.getBoundingClientRect().right > 320)) {
              list.push({
                tag: el.tagName,
                class: typeof el.className === 'string' ? el.className : '',
                scrollW: el.scrollWidth,
                offsetW: el.offsetWidth,
                rectRight: Math.round(el.getBoundingClientRect().right),
                text: (el.innerText || '').slice(0, 30).replace(/\\n/g, ' ')
              });
            } else {
              for (const c of el.children) walk(c);
            }
          }
          walk(root);
          return list;
        }

        return {
          docScrollW: document.documentElement.scrollWidth,
          bodyScrollW: document.body.scrollWidth,
          topKids,
          offenders: getLeafOffenders(document.body)
        };
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(check.result.result.value, null, 2));

    chrome.kill();
    server.close();
  } catch (e) {
    console.error(e);
    chrome.kill();
    server.close();
  }
}
run();

import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3333;
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
  console.log(`Server listening on port ${PORT}`);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch('http://127.0.0.1:9224/json/new', { method: 'PUT' });
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

    const routes = [
      '/',
      '/about/',
      '/activities/',
      '/activities/cyclic-sighing/',
      '/activities/box-breathing/',
      '/activities/breath-counting/',
      '/activities/nature-microbreak/',
      '/activities/movement-snack/',
      '/activities/quiet-rest/',
      '/check/',
      '/disclaimer/',
      '/experiments/',
      '/focus/',
      '/insights/',
      '/learn/',
      '/learn/how-we-rate/',
      '/learn/myths/',
      '/learn/breaks-energy/',
      '/learn/breaks-performance/',
      '/learn/focused-attention/',
      '/learn/breathwork-mood/',
      '/learn/nature-attention/',
      '/learn/movement/',
      '/learn/phone-blocking/',
      '/learn/phone-presence/',
      '/learn/if-then/',
      '/learn/sleep/',
      '/learn/noise/',
      '/learn/binaural/',
      '/learn/brain-training/',
      '/learn/body-doubling/',
      '/learn/multitasking/',
      '/learn/pvt-check/',
      '/privacy/',
      '/sounds/',
      '/404.html'
    ];

    const results = [];

    for (const r of routes) {
      const url = `http://127.0.0.1:${PORT}${r}?skipIntro=1`;
      await send('Page.navigate', { url });
      // wait for load and fonts
      await new Promise((resolve) => setTimeout(resolve, 800));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const innerW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;

          function getSelector(el) {
            if (!el) return '';
            if (el.id) return '#' + el.id;
            let path = [];
            while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body && el !== document.documentElement) {
              let selector = el.tagName.toLowerCase();
              if (el.className && typeof el.className === 'string') {
                const classes = el.className.trim().split(/\\s+/).filter(c => c && !c.includes(':') && !c.includes('['));
                if (classes.length) selector += '.' + classes.slice(0, 2).join('.');
              }
              path.unshift(selector);
              el = el.parentElement;
            }
            return path.join(' > ');
          }

          const elements = Array.from(document.querySelectorAll('*'));
          const offending = [];

          for (const el of elements) {
            // ignore script, style, head, etc.
            if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'TITLE', 'LINK'].includes(el.tagName)) continue;
            const rect = el.getBoundingClientRect();
            // ignore elements that are purely 0x0 or hidden
            if (rect.width === 0 && rect.height === 0) continue;
            // ignore screen-reader off-screen elements (e.g. left <= -1000)
            if (rect.right < 0 || rect.left <= -500) continue;

            const computed = window.getComputedStyle(el);
            if (computed.display === 'none' || computed.visibility === 'hidden') continue;

            const isWider = rect.width > innerW + 0.5;
            const overflowsRight = rect.right > innerW + 0.5;

            if (isWider || overflowsRight) {
              offending.push({
                tag: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className,
                selector: getSelector(el),
                rect: { left: rect.left, right: rect.right, width: rect.width },
                isWider,
                overflowsRight,
                computed: {
                  width: computed.width,
                  minWidth: computed.minWidth,
                  maxWidth: computed.maxWidth,
                  padding: computed.padding,
                  margin: computed.margin,
                  position: computed.position,
                  overflowX: computed.overflowX
                }
              });
            }
          }

          return {
            innerW,
            docScrollW,
            bodyScrollW,
            hasOverflow: docScrollW > innerW || bodyScrollW > innerW || offending.length > 0,
            offendingCount: offending.length,
            offending: offending.slice(0, 10)
          };
        })()`,
        returnByValue: true
      });

      const data = evalRes.result.result.value;
      results.push({ route: r, ...data });
    }

    console.log(JSON.stringify(results, null, 2));

    chrome.kill();
    server.close();
  } catch (err) {
    console.error('Audit failed:', err);
    chrome.kill();
    server.close();
  }
}

run();

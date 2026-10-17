import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3334;
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
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch('http://127.0.0.1:9225/json/new', { method: 'PUT' });
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
      '/check/',
      '/disclaimer/',
      '/experiments/',
      '/focus/',
      '/insights/',
      '/learn/',
      '/privacy/',
      '/sounds/'
    ];

    console.log('--- Testing Locale = BN ---');
    for (const r of routes) {
      const url = `http://127.0.0.1:${PORT}${r}?skipIntro=1`;
      await send('Page.navigate', { url });
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Set locale to bn and re-check
      await send('Runtime.evaluate', {
        expression: `(() => {
          localStorage.setItem('focuslab:lang', 'bn');
          // if react state already mounted, click the BN button
          const bnBtn = document.querySelector('button[lang="bn"]');
          if (bnBtn) bnBtn.click();
        })()`
      });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const innerW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;
          const elements = Array.from(document.querySelectorAll('*'));
          const offending = [];
          for (const el of elements) {
            if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'TITLE', 'LINK'].includes(el.tagName)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (rect.right < 0 || rect.left <= -500) continue;
            const computed = window.getComputedStyle(el);
            if (computed.display === 'none' || computed.visibility === 'hidden') continue;
            if (rect.width > innerW + 0.5 || rect.right > innerW + 0.5) {
              offending.push({ tag: el.tagName, class: el.className, w: rect.width, r: rect.right });
            }
          }
          return { docScrollW, bodyScrollW, offendingCount: offending.length, offending: offending.slice(0, 5) };
        })()`,
        returnByValue: true
      });

      const data = evalRes.result.result.value;
      if (data.docScrollW > 320 || data.bodyScrollW > 320 || data.offendingCount > 0) {
        console.log(`[OVERFLOW in BN] ${r}:`, data);
      }
    }

    console.log('--- Testing 200% Text Zoom (emulated via root font-size / zoom) ---');
    for (const r of routes) {
      const url = `http://127.0.0.1:${PORT}${r}?skipIntro=1`;
      await send('Page.navigate', { url });
      await new Promise((resolve) => setTimeout(resolve, 600));

      await send('Runtime.evaluate', {
        expression: `(() => {
          document.documentElement.style.fontSize = '200%';
        })()`
      });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const innerW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;
          const elements = Array.from(document.querySelectorAll('*'));
          const offending = [];
          for (const el of elements) {
            if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'TITLE', 'LINK'].includes(el.tagName)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (rect.right < 0 || rect.left <= -500) continue;
            const computed = window.getComputedStyle(el);
            if (computed.display === 'none' || computed.visibility === 'hidden') continue;
            if (rect.width > innerW + 0.5 || rect.right > innerW + 0.5) {
              offending.push({ tag: el.tagName, class: el.className, w: rect.width, r: rect.right });
            }
          }
          return { docScrollW, bodyScrollW, offendingCount: offending.length, offending: offending.slice(0, 5) };
        })()`,
        returnByValue: true
      });

      const data = evalRes.result.result.value;
      if (data.docScrollW > 320 || data.bodyScrollW > 320 || data.offendingCount > 0) {
        console.log(`[OVERFLOW in 200% Zoom] ${r}:`, data);
      }
    }

    console.log('--- Testing Opened Modals and Sheets ---');
    // Test BottomNav more sheet
    {
      const url = `http://127.0.0.1:${PORT}/?skipIntro=1`;
      await send('Page.navigate', { url });
      await new Promise((resolve) => setTimeout(resolve, 600));
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('button[aria-label="More sections"]');
          if (btn) btn.click();
        })()`
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      const resSheet = await send('Runtime.evaluate', {
        expression: `(() => {
          const innerW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          return { docScrollW, bodyScrollW: document.body.scrollWidth };
        })()`,
        returnByValue: true
      });
      console.log('BottomNav More Sheet open:', resSheet.result.result.value);
    }

    // Test Theme menu
    {
      const url = `http://127.0.0.1:${PORT}/?skipIntro=1`;
      await send('Page.navigate', { url });
      await new Promise((resolve) => setTimeout(resolve, 600));
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('button[aria-label^="Theme:"]');
          if (btn) btn.click();
        })()`
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      const resTheme = await send('Runtime.evaluate', {
        expression: `(() => {
          const innerW = window.innerWidth;
          const docScrollW = document.documentElement.scrollWidth;
          return { docScrollW, bodyScrollW: document.body.scrollWidth };
        })()`,
        returnByValue: true
      });
      console.log('Theme Menu open:', resTheme.result.result.value);
    }

    console.log('Audit completed!');
    chrome.kill();
    server.close();
  } catch (err) {
    console.error('Audit failed:', err);
    chrome.kill();
    server.close();
  }
}

run();

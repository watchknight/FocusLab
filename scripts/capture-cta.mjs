import { spawn } from 'child_process';
import fs from 'fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9230/json/new?http://localhost:3000/?skipIntro=1&theme=studio', { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let id = 1;
    const send = (m, p = {}) => new Promise(resolve => {
      const cur = id++;
      const fn = evt => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === cur) { ws.removeEventListener('message', fn); resolve(msg); }
      };
      ws.addEventListener('message', fn);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    for (const vp of [{ n: '1440', w: 1440, h: 900, m: false }, { n: '390', w: 390, h: 844, m: true }]) {
      await send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 2, mobile: vp.m });
      await send('Page.navigate', { url: 'http://localhost:3000/?skipIntro=1&theme=studio' });
      await new Promise(r => setTimeout(r, 2000));
      await send('Runtime.evaluate', {
        expression: `(() => {
          const headings = Array.from(document.querySelectorAll('h2'));
          const ctaHeading = headings.find(h => h.textContent.includes('Find out what helps you focus'));
          if (ctaHeading) ctaHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()`
      });
      await new Promise(r => setTimeout(r, 600));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`screenshots/cta_${vp.n}.png`, Buffer.from(shot.result.data, 'base64'));
    }
    console.log('Saved CTA screenshots');
    chrome.kill();
  } catch(e) {
    console.error(e);
    chrome.kill();
  }
}, 1500);

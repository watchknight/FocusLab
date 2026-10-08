import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9225/json/new?http://localhost:3000/?skipIntro=1&theme=studio', { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let id = 1;
    const send = (m, p = {}) => new Promise(resolve => {
      const cur = id++;
      const fn = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === cur) { ws.removeEventListener('message', fn); resolve(msg); }
      };
      ws.addEventListener('message', fn);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    const outDir = 'screenshots';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (const vp of [
      { name: '1440', width: 1440, height: 900, mobile: false },
      { name: '390', width: 390, height: 844, mobile: true }
    ]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile
      });
      await send('Page.navigate', { url: 'http://localhost:3000/?skipIntro=1&theme=studio' });
      await new Promise(r => setTimeout(r, 2500));

      const sections = ['Manifesto', 'How it works', 'How sharp is the evidence', 'Transparency and evidence counts', 'Frequently asked questions and get started'];
      
      for (const [idx, secName] of sections.entries()) {
        const secIndex = idx + 2; // S2 to S6
        const scrollRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.querySelector('[aria-label="${secName}"]');
            if (!el) return false;
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            return true;
          })()`,
          returnByValue: true
        });

        await new Promise(r => setTimeout(r, 600));

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(outDir, `s${secIndex}_${vp.name}.png`);
        fs.writeFileSync(filePath, Buffer.from(shot.result.data, 'base64'));
        console.log(`Saved ${filePath} (found: ${scrollRes.result.result.value})`);
      }
    }

    console.log('Finished capturing all scenes');
    chrome.kill();
  } catch (err) {
    console.error('Error during capture:', err);
    chrome.kill();
  }
}, 2000);

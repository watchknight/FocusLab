import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9228/json/new?http://localhost:3000/activities/cyclic-sighing?play=1', { method: 'PUT' });
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

    const outDir = 'screenshots-v3';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const players = [
      { name: 'player_cyclic_sighing', url: 'http://localhost:3000/activities/cyclic-sighing?play=1' },
      { name: 'player_breath_counting', url: 'http://localhost:3000/activities/breath-counting?play=1' },
      { name: 'player_nature_break', url: 'http://localhost:3000/activities/nature-microbreak?play=1' },
    ];

    for (const theme of ['studio', 'darkroom']) {
      for (const vp of [
        { name: '1440', width: 1440, height: 900, mobile: false },
        { name: '390', width: 390, height: 844, mobile: true },
        { name: 'landscape', width: 844, height: 390, mobile: true }
      ]) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: vp.mobile
        });

        for (const p of players) {
          await send('Page.navigate', { url: p.url });
          await new Promise(res => setTimeout(res, 800));

          await send('Runtime.evaluate', {
            expression: `document.documentElement.setAttribute('data-theme', '${theme}');`
          });
          await new Promise(res => setTimeout(res, 400));

          const shot = await send('Page.captureScreenshot', { format: 'png' });
          if (shot.result?.data) {
            const filename = `${p.name}_${vp.name}_${theme}.png`;
            fs.writeFileSync(path.join(outDir, filename), Buffer.from(shot.result.data, 'base64'));
            console.log(`Saved ${filename}`);
          }
        }
      }
    }

    console.log('Finished capturing active player screens!');
    ws.close();
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error in capture:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);

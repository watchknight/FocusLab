import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9235',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9235/json/new?http://localhost:3000/check', { method: 'PUT' });
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

    const outDir = 'screenshots-v3';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 1. Capture Check Test Stage
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

        await send('Page.navigate', { url: `http://localhost:3000/check?theme=${theme}` });
        await new Promise(r => setTimeout(r, 1200));

        await send('Runtime.evaluate', {
          expression: `document.documentElement.setAttribute('data-theme', '${theme}');`
        });

        // Click Begin
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Begin Pre-Check') || b.textContent.includes('Begin'));
            if (btn) btn.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 400));

        // Select ratings
        await send('Runtime.evaluate', {
          expression: `(() => {
            const rgs = document.querySelectorAll('[role="radiogroup"]');
            if (rgs.length >= 2) {
              const r1 = rgs[0].querySelectorAll('[role="radio"]')[2];
              const r2 = rgs[1].querySelectorAll('[role="radio"]')[2];
              if (r1) r1.click();
              if (r2) r2.click();
            }
          })()`
        });
        await new Promise(r => setTimeout(r, 300));

        // Start test
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start') || b.textContent.includes('Test'));
            if (btn) btn.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 600));

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        if (shot.result?.data) {
          const fn = `stage_check_test_${vp.name}_${theme}.png`;
          fs.writeFileSync(path.join(outDir, fn), Buffer.from(shot.result.data, 'base64'));
          console.log(`Saved ${fn}`);
        }
      }
    }

    // 2. Capture Focus Run Stage
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

        await send('Page.navigate', { url: `http://localhost:3000/focus?theme=${theme}` });
        await new Promise(r => setTimeout(r, 1200));

        await send('Runtime.evaluate', {
          expression: `document.documentElement.setAttribute('data-theme', '${theme}');`
        });

        // Enter task and click Start
        await send('Runtime.evaluate', {
          expression: `(() => {
            const input = document.getElementById('task-input') || document.querySelector('input[type="text"]');
            if (input) {
              const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
              setter.call(input, 'Deep focus task');
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          })()`
        });
        await new Promise(r => setTimeout(r, 300));

        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Focus Session'));
            if (btn) btn.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 800));

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        if (shot.result?.data) {
          const fn = `stage_focus_run_${vp.name}_${theme}.png`;
          fs.writeFileSync(path.join(outDir, fn), Buffer.from(shot.result.data, 'base64'));
          console.log(`Saved ${fn}`);
        }
      }
    }

    console.log('Finished capturing stage screenshots!');
    chrome.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);

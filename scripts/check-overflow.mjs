import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9223/json/new?http://localhost:3000/?skipIntro=1&theme=studio', { method: 'PUT' });
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 1500));

    const check = await send('Runtime.evaluate', {
      expression: '({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth })',
      returnByValue: true
    });
    console.log('Metrics:', check.result.result.value);

    const wide = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('*')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > window.innerWidth + 1;
      }).map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right })).slice(0, 10)`,
      returnByValue: true
    });
    console.log('Overflowing elements:', wide.result.result.value);

    // Also take an exact mobile screenshot!
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    import('fs').then(fs => {
      fs.writeFileSync('screenshot_390_studio.png', Buffer.from(shot.result.data, 'base64'));
      console.log('Saved perfect mobile screenshot_390_studio.png');
      chrome.kill();
    });
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1500);

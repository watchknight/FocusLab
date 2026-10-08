import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9229/json/new?http://localhost:3000/?skipIntro=1', { method: 'PUT' });
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
    await new Promise(r => setTimeout(r, 2000));
    const issues = await send('Runtime.evaluate', {
      expression: `(() => {
        const overlay = document.querySelector('nextjs-portal');
        if (!overlay?.shadowRoot) return 'No overlay';
        const shadow = overlay.shadowRoot;
        const errs = Array.from(shadow.querySelectorAll('[data-nextjs-dialog-body], [data-nextjs-toast-errors]')).map(el => el.textContent);
        const allText = shadow.textContent.replace(/\\s+/g, ' ').slice(-300);
        return { errs, allText };
      })()`,
      returnByValue: true
    });
    console.log('NextJS Issues text:', JSON.stringify(issues.result.result.value, null, 2));
    chrome.kill();
  } catch(e) {
    console.error(e);
    chrome.kill();
  }
}, 1500);

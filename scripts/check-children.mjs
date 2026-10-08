import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9231/json/new?http://localhost:3000/activities/cyclic-sighing/?play=1', { method: 'PUT' });
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
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        // Find GSAP
        const children = window.gsap ? window.gsap.globalTimeline.getChildren() : [];
        return children.map(c => ({
          duration: c.duration(),
          isActive: c.isActive(),
          vars: typeof c.vars === 'object' ? Object.keys(c.vars) : typeof c.vars
        }));
      })()`,
      returnByValue: true
    });
    console.log('GSAP children:', JSON.stringify(info.result?.result?.value, null, 2));

    chrome.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);

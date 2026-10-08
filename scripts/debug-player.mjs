import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9230/json/new?http://localhost:3000/activities/cyclic-sighing/?play=1', { method: 'PUT' });
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

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data.toString());
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[EXCEPTION]', msg.params.exceptionDetails);
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise(r => setTimeout(r, 2500));

    const pageInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          title: document.title,
          bodyText: document.body.innerText.slice(0, 500),
          hasError: document.body.innerText.includes('Something went wrong')
        };
      })()`,
      returnByValue: true
    });
    console.log('PAGE INFO:', JSON.stringify(pageInfo.result.result.value, null, 2));

    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);

import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--disable-gpu',
  '--no-sandbox'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9232/json/new?http://localhost:3000/check', { method: 'PUT' });
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

    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise(r => setTimeout(r, 2000));

    // TEST 1: Check Test Stage
    console.log('--- TESTING CHECK TEST STAGE ---');
    // Click Start / Begin button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Begin Pre-Check') || b.textContent.includes('Begin'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Select ratings and start test
    await send('Runtime.evaluate', {
      expression: `(() => {
        const radioGroups = document.querySelectorAll('[role="radiogroup"]');
        if (radioGroups.length >= 2) {
          const r1 = radioGroups[0].querySelectorAll('[role="radio"]')[2];
          const r2 = radioGroups[1].querySelectorAll('[role="radio"]')[2];
          if (r1) r1.click();
          if (r2) r2.click();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start') || b.textContent.includes('Test'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const checkStageResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const isCalm = document.documentElement.getAttribute('data-calm') === 'on';
        const activeTweens = window.gsap ? window.gsap.globalTimeline.getChildren() : [];
        const stageArea = document.querySelector('[role="button"][aria-label*="Reaction test"]');
        const runningCssAnimations = [];
        if (stageArea) {
          const allEls = [stageArea, ...stageArea.querySelectorAll('*')];
          for (const el of allEls) {
            const cs = window.getComputedStyle(el);
            if (cs.animationName && cs.animationName !== 'none') {
              runningCssAnimations.push({ tag: el.tagName, anim: cs.animationName });
            }
          }
        }
        const tweens = window.gsap ? window.gsap.globalTimeline.getChildren() : [];
        const tweenDetails = tweens.map(t => {
          let targetStr = 'unknown';
          try {
            if (typeof t.targets === 'function') {
              const tgts = t.targets();
              targetStr = Array.isArray(tgts) ? tgts.map(el => el?.tagName || el?.className || String(el)).join(', ') : String(tgts);
            }
          } catch(e) {}
          return {
            targetStr,
            duration: t.duration ? t.duration() : null,
            isActive: t.isActive ? t.isActive() : null
          };
        });
        return {
          stageMounted: !!stageArea,
          isCalm,
          gsapChildrenCount: tweens.length,
          tweenDetails,
          runningCssAnimations,
          stageBg: stageArea ? window.getComputedStyle(stageArea).backgroundColor : null
        };
      })()`,
      returnByValue: true
    });
    console.log('CHECK TEST STAGE RESULT:', JSON.stringify(checkStageResult.result?.result?.value, null, 2));

    // TEST 2: Focus Run Stage
    console.log('--- TESTING FOCUS RUN STAGE ---');
    await send('Page.navigate', { url: 'http://localhost:3000/focus/' });
    await new Promise(r => setTimeout(r, 2000));

    // Enter intention and click Start
    await send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('task-input') || document.querySelector('input[type="text"]');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'Write unit tests');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Focus Session'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const focusRunResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const isCalm = document.documentElement.getAttribute('data-calm') === 'on';
        const activeTweens = window.gsap ? window.gsap.globalTimeline.getChildren() : [];
        const ring = document.querySelector('circle[stroke="#F2F3F5"]');
        const runContainer = ring ? ring.closest('.fixed.inset-0') : null;
        const runningCssAnimations = [];
        if (runContainer) {
          const allEls = [runContainer, ...runContainer.querySelectorAll('*')];
          for (const el of allEls) {
            const cs = window.getComputedStyle(el);
            if (cs.animationName && cs.animationName !== 'none') {
              runningCssAnimations.push({ tag: el.tagName, anim: cs.animationName });
            }
          }
        }
        const tweens = window.gsap ? window.gsap.globalTimeline.getChildren() : [];
        const tweenDetails = tweens.map(t => {
          let targetStr = 'unknown';
          try {
            if (typeof t.targets === 'function') {
              const tgts = t.targets();
              targetStr = Array.isArray(tgts) ? tgts.map(el => el?.tagName || el?.className || String(el)).join(', ') : String(tgts);
            }
          } catch(e) {}
          return {
            targetStr,
            duration: t.duration ? t.duration() : null,
            isActive: t.isActive ? t.isActive() : null
          };
        });
        return {
          runMounted: !!runContainer,
          isCalm,
          gsapChildrenCount: tweens.length,
          tweenDetails,
          runningCssAnimations,
          runBg: runContainer ? window.getComputedStyle(runContainer).backgroundColor : null
        };
      })()`,
      returnByValue: true
    });
    console.log('FOCUS RUN STAGE RESULT:', JSON.stringify(focusRunResult.result?.result?.value, null, 2));

    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve('out');

function getHtmlFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const rel = path.join(base, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath, rel));
    } else if (file === 'index.html' || file.endsWith('.html')) {
      results.push({ fullPath, rel });
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(outDir);
const report = [];

for (const { fullPath, rel } of htmlFiles) {
  let route = '/' + rel.replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '/index') route = '/';

  const html = fs.readFileSync(fullPath, 'utf8');
  // Extract script tags (ignoring noModule polyfills) and link preload tags
  const matches = new Set();
  const scriptTagRegex = /<script\b([^>]*)>/g;
  let sMatch;
  while ((sMatch = scriptTagRegex.exec(html)) !== null) {
    const attrs = sMatch[1];
    if (attrs.includes('noModule') || attrs.includes('nomodule')) continue;
    const srcMatch = /src="(\/_next\/static\/chunks\/[^"]+\.js)"/.exec(attrs);
    if (srcMatch) matches.add(srcMatch[1]);
  }
  const linkRegex = /<link\b[^>]*href="(\/_next\/static\/chunks\/[^"]+\.js)"[^>]*>/g;
  let lMatch;
  while ((lMatch = linkRegex.exec(html)) !== null) {
    matches.add(lMatch[1]);
  }

  let totalRaw = 0;
  let totalGzip = 0;

  for (const scriptPath of matches) {
    const decoded = decodeURIComponent(scriptPath);
    const diskPath = path.join(outDir, decoded.slice(1));
    if (fs.existsSync(diskPath)) {
      const content = fs.readFileSync(diskPath);
      totalRaw += content.length;
      totalGzip += zlib.gzipSync(content).length;
    } else {
      console.warn(`File not found: ${diskPath}`);
    }
  }

  report.push({
    route,
    scriptCount: matches.size,
    rawKb: (totalRaw / 1024).toFixed(1),
    gzipKb: (totalGzip / 1024).toFixed(1),
  });
}

report.sort((a, b) => a.route.localeCompare(b.route));
console.table(report);

// Detail landing chunks
const landingHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const landingMatches = new Set();
const scriptTagRegex = /<script\b([^>]*)>/g;
let sMatch;
while ((sMatch = scriptTagRegex.exec(landingHtml)) !== null) {
  const attrs = sMatch[1];
  if (attrs.includes('noModule') || attrs.includes('nomodule')) continue;
  const srcMatch = /src="(\/_next\/static\/chunks\/[^"]+\.js)"/.exec(attrs);
  if (srcMatch) landingMatches.add(srcMatch[1]);
}
const linkRegex = /<link\b[^>]*href="(\/_next\/static\/chunks\/[^"]+\.js)"[^>]*>/g;
let lMatch;
while ((lMatch = linkRegex.exec(landingHtml)) !== null) {
  landingMatches.add(lMatch[1]);
}
const landingChunks = [];
for (const s of landingMatches) {
  const diskPath = path.join(outDir, decodeURIComponent(s).slice(1));
  if (fs.existsSync(diskPath)) {
    const content = fs.readFileSync(diskPath);
    const contentStr = content.toString('utf8');
    const modules = [];
    if (contentStr.includes('react-dom') || contentStr.includes('createRoot')) modules.push('react-dom');
    if (contentStr.includes('gsap') || contentStr.includes('ScrollTrigger')) modules.push('gsap');
    if (contentStr.includes('next/dist')) modules.push('next');
    if (contentStr.includes('zustand')) modules.push('zustand');
    if (contentStr.includes('recharts')) modules.push('recharts');
    if (contentStr.includes('lenis')) modules.push('lenis');
    landingChunks.push({
      file: path.basename(diskPath),
      modules: modules.join(', '),
      rawKb: (content.length / 1024).toFixed(1),
      gzipKb: (zlib.gzipSync(content).length / 1024).toFixed(1),
    });
  }
}
landingChunks.sort((a, b) => parseFloat(b.rawKb) - parseFloat(a.rawKb));
console.log('\nLanding page chunks:');
console.table(landingChunks);


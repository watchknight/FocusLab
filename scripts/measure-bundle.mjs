import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
const scriptMatches = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)];
const scriptPaths = [...new Set(scriptMatches.map(m => m[1]))];

console.log('Script tags on /:', scriptPaths.length);
let totalRaw = 0;
let totalGzip = 0;

for (const p of scriptPaths) {
  const localPath = path.join('.next', p.replace(/^\/_next\//, ''));
  if (fs.existsSync(localPath)) {
    const buf = fs.readFileSync(localPath);
    totalRaw += buf.length;
    const gz = zlib.gzipSync(buf).length;
    totalGzip += gz;
    console.log(p.split('/').pop(), (buf.length / 1024).toFixed(1) + ' KB raw', (gz / 1024).toFixed(1) + ' KB gz');
  }
}

console.log('--- FIRST LOAD JS ON / ---');
console.log('Raw:', (totalRaw / 1024).toFixed(1), 'KB');
console.log('Gzip:', (totalGzip / 1024).toFixed(1), 'KB');

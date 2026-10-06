import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure SW has proper cache version before build copies public/
try {
  const commitHash = process.env.RENDER_GIT_COMMIT || Date.now().toString();
  const cacheName = `focuslab-cache-${commitHash}`;
  const swPath = path.join(__dirname, 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    let content = fs.readFileSync(swPath, 'utf8');
    content = content.replace(/const CACHE_NAME = ['"][^'"]+['"];/, `const CACHE_NAME = '${cacheName}';`);
    fs.writeFileSync(swPath, content, 'utf8');
  }
} catch {
  // Ignored
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

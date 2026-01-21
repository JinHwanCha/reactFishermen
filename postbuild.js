import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, 'dist');
const discussionGuidePath = path.join(distPath, 'discussion-guide');

// discussion-guide 폴더 생성
if (!fs.existsSync(discussionGuidePath)) {
  fs.mkdirSync(discussionGuidePath, { recursive: true });
}

// discussion-guide.html을 discussion-guide/index.html로 이동
const sourceFile = path.join(distPath, 'discussion-guide.html');
const targetFile = path.join(discussionGuidePath, 'index.html');

if (fs.existsSync(sourceFile)) {
  fs.renameSync(sourceFile, targetFile);
  console.log('✓ Moved discussion-guide.html → discussion-guide/index.html');
} else {
  console.log('⚠ discussion-guide.html not found');
}

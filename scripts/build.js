#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// リリースに含めるファイル/ディレクトリ
const INCLUDE_FILES = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'popup.css',
  'styles.css',
  'icons/',
  'images/'
];

async function build() {
  console.log('🔨 Building X Pro Enhancer extension...');

  // distディレクトリを作成
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // manifest.jsonを読み込んでバージョンを取得
  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8')
  );
  const version = manifest.version;

  // ZIPファイル名
  const zipFileName = `x-pro-enhancer-v${version}.zip`;
  const zipPath = path.join(distDir, zipFileName);

  // ZIPアーカイブを作成
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // 最大圧縮
  });

  output.on('close', () => {
    const size = (archive.pointer() / 1024).toFixed(2);
    console.log(`✅ Build complete: ${zipFileName} (${size} KB)`);
    console.log(`📦 Package location: ${zipPath}`);
    console.log('\n🚀 Ready to upload to Chrome Web Store!');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // ファイルを追加
  INCLUDE_FILES.forEach((file) => {
    const filePath = path.join(__dirname, '..', file);

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        archive.directory(filePath, file);
      } else {
        archive.file(filePath, { name: file });
      }
    }
  });

  await archive.finalize();
}

// 実行
build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});

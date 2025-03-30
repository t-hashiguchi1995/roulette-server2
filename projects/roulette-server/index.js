const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

/**
 * 指定されたWebP画像をPNGに変換する
 * @param {string} filePath - 変換対象のWebP画像パス
 */
async function convertImage(filePath) {
  const outputPath = filePath.replace(/\.webp$/i, '.png');
  try {
    await sharp(filePath).png().toFile(outputPath);
    console.log(`変換完了: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`変換エラー: ${filePath}`, error);
  }
}

/**
 * 指定されたパス（ファイルまたはディレクトリ）を再帰的に処理し、WebP画像を変換する
 * @param {string} inputPath - 対象パス
 */
async function processPath(inputPath) {
  try {
    const stats = await fs.stat(inputPath);
    if (stats.isDirectory()) {
      const items = await fs.readdir(inputPath);
      for (const item of items) {
        const fullPath = path.join(inputPath, item);
        await processPath(fullPath);
      }
    } else if (stats.isFile()) {
      if (path.extname(inputPath).toLowerCase() === '.webp') {
        await convertImage(inputPath);
      }
    }
  } catch (error) {
    console.error(`エラー: ${inputPath} -`, error);
  }
}

async function main() {
  const input = process.argv[2];
  if (!input || input === '--help') {
    console.log("使用法: node index.js <画像ファイルまたはディレクトリパス>");
    process.exit(0);
  }
  await processPath(input);
}

main();
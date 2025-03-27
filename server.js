// @ts-nocheck
console.log("Current directory: " + process.cwd());
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 静的ファイルの提供（assets フォルダ）
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// multerの設定（メモリストレージを使用）
const upload = multer({ storage: multer.memoryStorage() });

// ルートパス: public/index.html を返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 画像アップロードと変換のエンドポイント
app.post("/upload", upload.single("webpImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("ファイルがアップロードされていません。");
  }
  try {
    const convertedBuffer = await sharp(req.file.buffer).png().toBuffer();
    res.set("Content-Disposition", "attachment; filename=converted.png");
    res.contentType("image/png");
    res.send(convertedBuffer);
  } catch (error) {
    console.error("変換エラー:", error);
    res.status(500).send("変換中にエラーが発生しました。");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// @ts-nocheck
console.log("Current directory: " + process.cwd());
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const archiver = require('archiver');

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

// 画像アップロードと変換のエンドポイント（複数ファイル対応）
app.post("/upload", upload.array("webpImage"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("ファイルがアップロードされていません。");
  }
  try {
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=converted.zip');
    const archive = archiver('zip');
    archive.on('error', (err) => {
      console.error("アーカイブエラー:", err);
      return res.status(500).send("アーカイブ作成中にエラーが発生しました。");
    });
    archive.pipe(res);
    let successfulConversions = 0;
    for (const file of req.files) {
      console.log("変換開始：", file.originalname);
      try {
        const convertedBuffer = await sharp(file.buffer).png().toBuffer();
        const newName = path.parse(file.originalname).name + ".png";
        archive.append(convertedBuffer, { name: newName });
        console.log("変換成功：", newName);
        successfulConversions++;
      } catch (error) {
        console.error("変換エラー:", error, "ファイル名:", file.originalname);
      }
    }
    if (successfulConversions === 0) {
      archive.append(Buffer.from("全てのファイル変換に失敗しました。"), { name: "error.txt" });
    }
    await archive.finalize();
  } catch (err) {
    console.error("エンドポイント全体のエラー:", err);
    res.status(500).send("処理中にエラーが発生しました。");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

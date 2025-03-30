<p align="center">
  <img src="assets/header.svg" alt="Header">
</p>

# 🚀 プロジェクト概要

本プロジェクトは、WebP画像をPNG形式に変換するためのシンプルなツールです。  
Node.jsおよびSharpライブラリを用いており、コマンドラインから画像ファイルやディレクトリを指定して実行できます。

# 🛠️ 使い方

## 基本的な使い方
```bash
node index.js <画像ファイルまたはディレクトリパス>
```
例:
```bash
node index.js images/sample.webp
```

## 注意事項
- 変換元の画像はWebP形式である必要があります。
- 変換後、元のファイルと同じディレクトリにPNGファイルが生成されます。

# 📦 依存関係

- [Node.js](https://nodejs.org/)
- [Sharp](https://sharp.pixelplumbing.com/)

# 📃 ライセンス

本プロジェクトはMITライセンスの下で公開されています。
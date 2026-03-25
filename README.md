# Multi Comment Streamer 📺

YouTube Live と ツイキャスのコメントを1つの画面に統合し、OBSなどの配信ソフトで利用できるオーバーレイ・アプリケーションです。
Next.js で構築されており、美しくカスタマイズ性の高いコメント表示を提供します。

## ✨ 主な機能

- **マルチプラットフォーム統合**: YouTube Live と ツイキャスのコメントをリアルタイムに同時表示。
- **表示位置のカスタマイズ**: URLパラメータ（`pos=left|right`）またはセットアップ画面から、コメントの表示位置を左右に切り替え可能。
- **洗練されたデザイン**: グラスモーフィズム（半透明）を採用したモダンなUI。プラットフォームごとの色分け（YouTube: 赤、ツイキャス: 青）で視認性を確保。
- **スムーズなアニメーション**: `framer-motion` を使用した滑らかな出現・消失エフェクト。
- **自動クリア機能**: 60秒経過した古いコメントを自動的に画面から除外。
- **サブパス対応**: GitHub Pages などのサブディレクトリ環境へのデプロイにも完全対応。

## 🚀 セットアップ方法

### 1. 環境変数の設定
プロジェクトのルートに `.env.local` を作成し、以下の情報を設定してください。

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=あなたのYouTube_APIキー
NEXT_PUBLIC_TWITCASTING_CLIENT_ID=あなたのツイキャスClient_ID
```

### 2. ローカルでの起動
```bash
npm install
npm run dev
```
起動後、ブラウザで `http://localhost:3000` にアクセスします。

### 3. テスト（サンプルページ）
配信環境がない状態でも、以下のURLでダミーコメントの動作を確認できます。表示位置のテストも可能です。
- `http://localhost:3000/sample`
- `http://localhost:3000/sample?pos=right`

## 🎥 OBSでの使い方

1. セットアップ画面（`/`）で **YouTube Video ID** または **ツイキャス Screen ID** を入力します。
2. 「表示位置のカスタマイズ」で希望の位置を選択します。
3. 生成された「オーバーレイURL」をコピーします。
4. OBSで「ブラウザ」ソースを追加し、URLを貼り付けます。
   - **幅**: 1920
   - **高さ**: 1080
   - **背景**: 透明度を維持するため、カスタムCSSは不要です。

## 🛠 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📝 開発ドキュメント

各機能の実装詳細や不具合修正の記録は `docs/` ディレクトリに保存されています。
- [表示位置指定機能 (URLパラメータ)](./docs/overlay_position_customization/)
- [セットアップ画面の修正とURL生成](./docs/setup_page_fix/)
- [サンプルコメントページ](./docs/sample_comment_page/)

# Walkthrough: YouTube & TwitCasting Comment Integration Overlay

## 変更内容
1. **プロジェクト基盤環境構築**
   - Next.js 15 (App Router), TypeScript, Tailwind CSS v4 のセットアップ
   - Framer Motion, lucide-react (アイコン用) の導入
   - GitHub Pages での完全静的ホスティングを想定し `next.config.ts` に `output: "export"` を追加
2. **UI/画面実装**
   - **`/` (初期設定画面)**: 
     - ユーザーが YouTube Video ID、ツイキャス Screen ID を入力できるフォーム実装
     - **OAuth & 環境変数対応**: YouTube API KeyとTwitCasting Client IDは `.env.local` からビルド時に読み込み、セキュアに管理。
     - ツイキャスのアクセストークンは公式の Implicit Flow (`response_type=token`) を用いて取得・保持する仕組みを実装。
   - **`/overlay` (オーバーレイ画面)**:
     - 透過背景 (`bg-transparent`) をベースとしたコメントカード表示画面
     - YouTube（赤系）と TwitCasting（青系）の明確な色分けと各種エラー表示
3. **データ通信ロジック**
   - **`useYouTubeChat`**: YouTube Data API v3 `liveChatMessages` に対するポーリング機能
   - **`useTwitCastingChat`**: TwitCasting API v2 に対する配信状態チェックおよび `comments` ポーリング機能
   - **統合キュー**: 直近のコメント取得順にマージし、最大30件まで表示、60秒経過したコメントは順次フェードアウト（Framer Motion 連携）

## 動作・利用手順 (OBS Studio での利用)

1. **環境変数の用意**
   - プロジェクト直下の `.env.local` を開き、あなたの API Key と Client ID を入力してください。
   - **注意**: ツイキャス Developer 側で App を登録する際、**Callback URL** を `http://localhost:3000/` （本番運用時はデプロイ先のGitHub Pages URL）に設定してください。
2. **ローカル起動 (`npm run dev`)** または **ビルド (`npm run build`)** します。
3. ブラウザで設定画面 (`/`) を開きます。
4. **「ツイキャスでログインして連携」** ボタンを押し、ツイキャスのアカウント連携を完了させます（トークンが取得されブラウザに保持されます）。
5. あなたの **YouTube Video ID** と **TwitCasting Screen ID** を入力します。
6. 画面下部の **「オーバーレイURL」** からコピーボタンを押します。
7. **OBS Studio** を開き、「ソース」から「ブラウザ」を追加します。
8. プロパティ画面で以下のように設定します：
   - **URL**: コピーしたURLを貼り付け
   - **幅**: `1920`
   - **高さ**: `1080`
   - カスタムCSS の `body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }` はそのままで問題ありません。
9. OBS上でコメントが統合されてポップアニメーション付きで表示されることを確認できます。

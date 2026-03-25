# 実装計画 - コメント表示エリアの制限

画面全体の上部10%と下部10%にコメントが表示されないように制限します。

## 概要
メインのコンテナ内に、上下10vhの余白を持つ絶対配置の「表示用コンテナ」を作成し、そこに `overflow-hidden` を適用します。これにより、コメントが上下10%の境界線で確実に切り取られるようにします。また、サンプルページのヘッダーやエラー表示も必要に応じて位置を調整します。

## 変更内容

### [Overlay]
#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/overlay/page.tsx)
- メインコンテナの `pt-[10vh] pb-[10vh]` を削除（あるいは調整）。
- コメントリストを `absolute inset-x-0 top-[10vh] bottom-[10vh] overflow-hidden` を持つコンテナで包む。
- エラー表示の位置を `top-4` から `top-[11vh]` などに調整（任意）。

### [Sample]
#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/sample/page.tsx)
- 同様に、コメントリストを制限用コンテナで包む。
- サンプルヘッダーの位置を `top-4` から `top-[11vh]` などに調整。

## 検証プラン

### ブラウザでの確認
- `npm run dev` で開発サーバーを起動（または起動済みを確認）。
- ブラウザでサンプルページ（`/sample`）を開く。
- デベロッパーツールを使用して、コンテナに `10vh` の上下パディングが適用されていること、およびコメントがその範囲内に収まっていることを確認する。
- コメントが多くなった際に、上部10%の境界で消えることを確認する。

# 実装計画 - コメント表示エリアの制限

画面全体の上部10%と下部10%にコメントが表示されないように制限します。

## 概要
メインのコンテナ要素に `pt-[10vh]` および `pb-[10vh]` を適用することで、コメントが表示される領域を画面中央の80%に制限します。`overflow-hidden` が既に適用されているため、この範囲外に出たコメントはクリップ（非表示）されます。

## 変更内容

### [Overlay]
#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/overlay/page.tsx)
- メインコンテナの `p-6` を `pt-[10vh] pb-[10vh] px-6` に変更。

### [Sample]
#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/sample/page.tsx)
- メインコンテナの `p-6` を `pt-[10vh] pb-[10vh] px-6` に変更。

## 検証プラン

### ブラウザでの確認
- `npm run dev` で開発サーバーを起動（または起動済みを確認）。
- ブラウザでサンプルページ（`/sample`）を開く。
- デベロッパーツールを使用して、コンテナに `10vh` の上下パディングが適用されていること、およびコメントがその範囲内に収まっていることを確認する。
- コメントが多くなった際に、上部10%の境界で消えることを確認する。

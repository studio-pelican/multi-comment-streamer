# 修正内容の確認 - コメント表示エリアの制限

画面全体の上部10%と下部10%にコメントを表示しないよう制限しました。

## 変更内容
メインコンテナに上下 `10vh` のパディングを適用し、コメントが表示される領域を画面中央の80%に制限しました。

### 対象ファイル
- [overlay/page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/overlay/page.tsx)
- [sample/page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/sample/page.tsx)

## 検証結果
ブラウザ（`/sample` ページ）にて以下の動作を確認しました。
- 画面の上端および下端から約10%の距離（`10vh`）に余白が確保されていること。
- コメントが上方に流れる際、上部10%の境界線で切り取られて非表示になること。

### スクリーンショット
![検証時のスクリーンショット](file:///Users/pelican/.gemini/antigravity/brain/2e63e0f3-558a-4081-87e6-41257610e53a/comment_flow_check_1774443618525.png)
*(上部および下部に余白があり、コメントが制限されたエリア内に収まっていることが確認できます)*

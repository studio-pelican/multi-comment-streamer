# オーバーレイ表示位置指定機能の追加（本番）の実装計画

サンプルページで実装した表示位置指定機能を、本番のオーバーレイページ（`/overlay`）にも反映します。これにより、配信者はOBS等のURLパラメータだけでコメントの表示位置を左右に切り替えられるようになります。

## Proposed Changes

### UI Components

#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/overlay/page.tsx)
- `useSearchParams` から `pos` (left/right) を取得するように変更します。
- メインの `div` コンデンサの `items-start`/`items-end` を切り替えます。
- 接続エラーなどの通知メッセージの表示位置も、`pos` に応じて調整します。
- 各コメントの `motion.div` において、`initial` の `x` 座標と `origin-left`/`origin-right` を切り替えます。

## Verification Plan

### Manual Verification
- `http://localhost:3000/overlay?yt=VIDEO_ID&pos=right` にアクセスし、コメントが右側に表示され、かつ右から出現することを確認します。
- `?pos=left` または指定なしで、従来通り左側に表示されることを確認します。
- エラー通知（APIキー不足など）も適切な位置に表示されることを確認します。

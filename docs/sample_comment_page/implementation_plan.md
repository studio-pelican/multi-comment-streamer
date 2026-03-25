# サンプルコメントページ作成の実装計画

ダミーのコメントを載せたサンプルページを `/sample` で作成します。これにより、実配信なしでコメントの表示（オーバーレイ）の見た目を確認できるようにします。

## Proposed Changes

### UI Components

#### [MODIFY] [page.tsx](file:///Users/pelican/repos/multi-comment-streamer/src/app/sample/page.tsx)
- `useSearchParams` を導入し、URLパラメータ `pos` (left/right) を取得します。
- 取得した `pos` の値に応じて、コンテナの `items-start`/`items-end` および `framer-motion` の初期移動方向 (`x`) を切り替えます。
- `Suspense` でコンポーネントを囲うように修正します（Next.js の制約）。

## Verification Plan

### Manual Verification
- `npm run dev` でローカルサーバーを起動し、 `http://localhost:3000/sample?pos=right` にアクセスして右側に表示されることを確認します。
- `?pos=left` またはパラメータなしで左側に表示されることを確認します。
- アニメーションの方向が左右で適切に切り替わっていることを確認します。

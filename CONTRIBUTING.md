# コントリビューションガイド

X Pro Enhancerへの貢献を検討いただきありがとうございます！

## 開発の始め方

### 前提条件
- Node.js 20.x以上
- npm 10.x以上
- Git
- Chrome/Edge ブラウザ

### セットアップ
```bash
# リポジトリをクローン
git clone https://github.com/Hondy000/x-pro-enhancer.git
cd x-pro-enhancer

# 依存関係をインストール
npm install

# 開発開始
npm run dev  # 今後実装予定
```

## ブランチ戦略

### ブランチ命名規則
- `feature/issue-{番号}-{説明}` - 新機能
- `fix/issue-{番号}-{説明}` - バグ修正
- `perf/issue-{番号}-{説明}` - パフォーマンス改善
- `chore/issue-{番号}-{説明}` - ビルド/開発環境
- `docs/issue-{番号}-{説明}` - ドキュメント

### 例
```bash
git checkout -b feature/issue-8-custom-css
git checkout -b fix/issue-1-settings
```

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/)に従ってください。

### フォーマット
```
<type>(<scope>): <subject>

<body>

<footer>
```

### タイプ
- `feat`: 新機能
- `fix`: バグ修正
- `perf`: パフォーマンス改善
- `refactor`: リファクタリング
- `test`: テスト
- `docs`: ドキュメント
- `chore`: ビルド/ツール
- `style`: コードスタイル

### 例
```
feat(css): カスタムCSS機能を追加

ユーザーが独自のCSSを適用できる機能を実装。
プリセットテーマとリアルタイムプレビューに対応。

Closes #8
```

## プルリクエスト

1. Issueを作成（または既存のIssueを選択）
2. ブランチを作成
3. 変更を実装
4. テストを実行（`npm test`）
5. リントチェック（`npm run lint`）
6. プルリクエストを作成

### PRチェックリスト
- [ ] 関連するIssue番号を記載
- [ ] テストがパスしている
- [ ] リントエラーがない
- [ ] ドキュメントを更新（必要な場合）
- [ ] スクリーンショットを添付（UI変更の場合）

## 開発ガイドライン

### コードスタイル
- ESLintルールに従う
- インデントは2スペース
- セミコロンあり
- シングルクォート使用

### テスト
- 新機能には必ずテストを追加
- 既存のテストを壊さない
- カバレッジ80%以上を維持

### Chrome Extension開発のベストプラクティス
1. 最小権限の原則
2. Content Security Policy準拠
3. パフォーマンスを考慮
4. エラーハンドリング

## TypeScript移行（進行中）

現在JavaScriptからTypeScriptへの移行を進めています。
新しいコードはTypeScriptで書くことを推奨します。

### 型定義
```typescript
// 設定の型定義例
interface Config {
  enabled: boolean;
  useClassicBird: boolean;
  replaceFavicon: boolean;
  customLogoUrl?: string;
}
```

## 質問・サポート

- Issueで質問
- Discussionsで議論
- PRでの提案

## ライセンス

このプロジェクトに貢献することで、あなたのコードがMITライセンスの下で公開されることに同意したものとみなされます。
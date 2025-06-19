# 開発ロードマップ

## 優先開発順序（更新版）

### Phase 1: 基盤整備（v1.1.0）
**目標**: TypeScript化により今後の開発効率を向上

1. **最優先: TypeScript移行** 🎯
   - `feature/issue-6-typescript`
   - 型安全性の確保
   - 今後の機能開発の基盤
   - 推定期間: 1週間

2. **緊急修正**
   - `fix/issue-1-settings` - 設定の不整合
   - `fix/issue-5-security` - セキュリティ強化
   - 推定期間: 2-3日

### Phase 2: 機能拡張（v1.2.0）
**目標**: ユーザー価値の提供

3. **カスタムCSS機能**
   - `feature/issue-8-custom-css`
   - すぐに価値を提供できる
   - TypeScriptベースで実装
   - 推定期間: 1週間

4. **パフォーマンス最適化**
   - `perf/issue-2-mutation-observer`
   - UX改善
   - 推定期間: 3日

### Phase 3: 高度な機能（v2.0.0）
**目標**: Pro版としての差別化

5. **カラム管理機能**
   - `feature/issue-8-column-manager`
   - X Proユーザー向け主要機能
   - 推定期間: 2週間

6. **UI/UX改善**
   - `fix/issue-7-ui-improvements`
   - 推定期間: 1週間

## ブランチ戦略

### 即座に作成するブランチ
```bash
# TypeScript移行用ブランチ（最優先）
git checkout -b feature/issue-6-typescript

# 緊急修正用ブランチ
git checkout -b fix/issue-1-settings
git checkout -b fix/issue-5-security
```

### TypeScript移行の利点
1. **型安全性**: バグの早期発見
2. **IDE支援**: 自動補完とリファクタリング
3. **保守性**: 将来の機能追加が容易
4. **Chrome API型定義**: @types/chromeによる型サポート

### 移行計画
1. TypeScript環境構築
2. 既存JSファイルを.tsに変換
3. 型定義の追加
4. ビルドプロセスの更新
5. テストの移行

## コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
perf: パフォーマンス改善
refactor: リファクタリング
test: テスト追加/修正
docs: ドキュメント更新
chore: ビルド/開発環境
style: コードスタイル
```

## マイルストーン

- **2025年1月末**: v1.1.0 (TypeScript化完了)
- **2025年2月中旬**: v1.2.0 (カスタムCSS機能)
- **2025年3月末**: v2.0.0 (カラム管理機能)
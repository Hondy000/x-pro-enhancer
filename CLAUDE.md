# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

X Pro Enhancer - X Proのユーザーエクスペリエンスを向上させるChrome拡張機能。クラシックTwitter鳥ロゴの復元から始まり、カラム管理やカスタムCSSなど、パワーユーザー向けの機能を提供します。

## 開発コマンド

```bash
# リント実行
npm run lint

# リント自動修正
npm run lint:fix

# Chrome Web Store用パッケージ作成（dist/x-pro-enhancer-v{version}.zip）
npm run package

# ビルドのみ実行
npm run build

# クリーンアップ
npm run clean
```

### テスト手順
```bash
# 1. Chrome拡張機能をローカルでテスト
# chrome://extensions/ を開く
# デベロッパーモードを有効化
# 「パッケージ化されていない拡張機能を読み込む」でこのディレクトリを選択

# 2. 動作確認
# - https://x.com/
# - https://twitter.com/
# - https://pro.x.com/
# - https://mobile.x.com/
```

## アーキテクチャと実装詳細

### Manifest V3実装パターン
- **Service Worker型バックグラウンド処理**: `background.js`で初期設定と状態管理
- **Content Script挿入タイミング**: `document_start`で早期DOM操作を実現
- **最小限の権限**: `storage`（設定保存）と`tabs`（タブ通信）のみ
- **chrome.storage.sync使用**: デバイス間での設定同期対応

### ロゴ置換の実装戦略
```javascript
// 13種類以上のセレクターでXロゴを検出（content.js:44-58）
const logoSelectors = [
  'svg[aria-label*="X"]',
  '[data-testid="Logo"]',
  'a[href="/home"] svg',
  // X.com固有のクラス名も対象
  '.r-13v1u17.r-4qtqp9.r-yyyyoo...',
  // ... 他多数
];
```

### 動的コンテンツ対応（SPA対策）
- **3つのMutationObserver**:
  1. タイトル監視: `<title>`要素の変更を検出
  2. ヘッド監視: ファビコンの動的追加を検出
  3. ボディ監視: ロゴ要素の追加を検出（100msデバウンス）
- **遅延読み込み対応**: body要素が存在しない場合の待機処理

### パフォーマンス最適化
- **デバウンス処理**: MutationObserverの過剰な発火を防止（100ms）
- **重複チェック**: `data-bird-replaced`属性で置換済み要素をスキップ
- **要素サイズ保持**: `getBoundingClientRect()`で元のサイズを維持

### ドキュメントタイトル置換（常時有効）
```javascript
// "X" → "Twitter"への自動置換パターン（content.js:155-168）
- "X Pro" → "Twitter Pro"
- "X / " → "Twitter / "
- " / X" → " / Twitter"
- 単独の"X" → "Twitter"
```

## 技術的制約と対処法

### Content Security Policy (CSP)対応
- インラインスタイル/スクリプト挿入不可 → 外部CSSファイル使用
- 外部画像はHTTPS必須 → data URL推奨
- Web Accessible Resources最小化 → twitter-bird.svgのみ公開

### DOM構造の変更への耐性
- 複数のフォールバックセレクター実装
- aria-label、data-testid、クラス名など多角的な検出
- X.com特有のハッシュ化されたクラス名にも対応

### ストレージ容量制限への対策
- chrome.storage.sync: 100KB総容量、8KB/アイテム
- カスタムロゴアップロード時はdata URL変換でサイズ注意
- 大きな画像は圧縮推奨

## デバッグのヒント

### コンテンツスクリプトのデバッグ
```javascript
// X.comページで開発者ツールを開き、Consoleタブで確認
// 置換されない要素がある場合:
document.querySelectorAll('svg[viewBox]') // SVG要素を確認
document.querySelectorAll('[data-testid]') // data-testid属性を確認
```

### ポップアップのデバッグ
拡張機能アイコンを右クリック → 「ポップアップを検証」

### Service Workerのデバッグ
chrome://extensions/ → 「Service Worker」リンクをクリック

## よくあるトラブルシューティング

### ロゴが置換されない
1. `content.js`の`logoSelectors`配列に新しいセレクターを追加
2. MutationObserverのデバウンス時間を調整（現在100ms）
3. CSPエラーをコンソールで確認

### ファビコンが元に戻る
- X.comが動的にファビコンを更新するため、継続的な監視が必要
- `headObserver`が正しく動作しているか確認

### 設定が即座に反映されない
- chrome.storage.syncの同期遅延の可能性
- 無効化時は意図的にページリロードを実行

## リリース手順

```bash
# 1. バージョン更新（package.jsonとmanifest.json両方）
# 2. リント実行とパッケージ作成
npm run package

# 3. 生成されたZIPファイルを確認
ls -la dist/x-pro-enhancer-v*.zip

# 4. Chrome Web Storeにアップロード
```

## 最近の変更点

- プロジェクト名を「X Pro Enhancer」に変更
- 今後の機能拡張（カラム管理、カスタムCSS）を考慮した説明に更新
- テキスト置換機能を削除（ドキュメントタイトルの置換は常時有効）
- 設定オプションを簡素化
- パフォーマンス最適化の強化
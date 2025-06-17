# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

X（旧Twitter）のロゴとブランディングを、多くのユーザーに愛されたクラシックな青い鳥（Twitter Bird）に戻すChrome拡張機能です。X.com（旧Twitter.com）全体で大きな「X」ロゴの代わりに、懐かしい青い鳥のロゴを表示します。

## 主要コマンド

### 拡張機能のテスト
```bash
# Chrome拡張機能はブラウザで直接テストする必要があります
# 1. chrome://extensions/ を開く
# 2. デベロッパーモードを有効化
# 3. 「パッケージ化されていない拡張機能を読み込む」でこのディレクトリを選択
```

### デフォルトアイコン
```bash
# この拡張機能は、クラシックなTwitterの青い鳥をデフォルトで使用
# カスタムロゴも設定可能ですが、多くのユーザーは青い鳥を好みます
```

## アーキテクチャ

### Manifest V3構成
- **manifest.json**: Chrome拡張機能の設定ファイル
  - content_scriptsでX.comとtwitter.comドメインでのスクリプト実行を定義
  - faviconの置換も含む
  - service_workerでバックグラウンド処理を管理
  - storageとtabs権限でユーザー設定とタブ管理を実現

### コンテンツスクリプト（content.js）
- X.comのDOM要素を監視し、Xロゴを青い鳥に置換
- ファビコンも青い鳥に変更
- MutationObserverで動的コンテンツに対応
- Chrome Runtime APIでポップアップからの設定変更をリアルタイム反映

### バックグラウンドサービスワーカー（background.js）
- 拡張機能の初期化と設定管理
- タブの更新イベントを監視
- コンテンツスクリプトとポップアップ間の通信を仲介

### ポップアップUI（popup.html/js/css）
- ユーザー設定インターフェース
- ロゴのURL入力またはファイルアップロード対応
- 設定はchrome.storage.localに保存

## 重要な実装詳細

### ロゴ置換ロジック
- 複数のセレクターを使用してXロゴを特定:
  - `svg[aria-label*="X"]`, `svg[aria-label*="Twitter"]`
  - `img[alt*="X"]`
  - `[data-testid="Logo"]`
  - `a[href="/home"] svg`, `header svg`
  - ファビコン: `link[rel="icon"]`, `link[rel="shortcut icon"]`
  - X固有のクラス名（`.r-13v1u17`, `.r-1cvl2hr`など）
- 元の要素のサイズを保持（`getBoundingClientRect()`使用）
- `object-fit: contain`で画像のアスペクト比を維持
- SVG要素をIMG要素に置換する際、クラス名を継承

### テキスト置換（オプション）
- 「X」を「Twitter」に置換することも可能
- 対象要素: `h1`〜`h6`, `span`, `div`, `p`, `a`
- 大文字小文字を区別しない置換
- HTMLを破壊しないよう、TEXT_NODEのみを置換
- document.titleも「Twitter」に戻すことが可能

### 設定の永続化
- **chrome.storage.sync**を使用（localではない）- デバイス間同期が可能
- デフォルト設定:
  - `enabled: true`
  - `useClassicBird: true`（クラシックな青い鳥を使用）
  - `replaceFavicon: true`（ファビコンも置換）
  - `replaceText: false`（テキスト置換はオプション）
  - `customPageName: 'Twitter'`
  - `customLogoUrl: ''`（カスタムロゴURL、青い鳥がデフォルト）

### コンポーネント間の通信フロー
1. **初期化フロー**:
   - background.js: `onInstalled`でデフォルト設定を初期化
   - content.js: ページロード時に`storage.sync.get`で設定を取得
   - 設定が有効なら即座に置換処理を実行

2. **設定更新フロー**:
   - popup.js: 保存ボタンクリック → `storage.sync.set`
   - popup.js: アクティブタブに`updateConfig`メッセージ送信
   - content.js: メッセージ受信 → 設定更新 → 再置換（無効化時はリロード）

3. **リアルタイム更新**:
   - MutationObserverで動的に追加されるDOM要素を監視
   - デバウンス処理（100ms）で過剰な処理を防止
   - `window.logoReplacerTimeout`でタイマーを管理

## 開発時の注意点

1. **DOM選択の脆弱性**: X.comのDOM構造は変更される可能性があるため、複数の選択方法を用意
2. **パフォーマンス**: MutationObserverの使用を最小限に抑え、必要な要素のみを監視
3. **セキュリティ**: 外部URLのロゴを使用する際はHTTPSを推奨
4. **互換性**: Manifest V3仕様に準拠し、将来のChrome更新に対応
5. **ファビコン置換**: 動的に生成されるファビコンも監視して置換
6. **青い鳥のアセット**: デフォルトの青い鳥画像は拡張機能に同梱
7. **エラーハンドリング**: ロゴ画像の読み込みエラーは`onerror`で非表示にする

## 実装上の制約と回避策

### 制約事項
1. **Content Security Policy (CSP)**: X.comのCSPにより、インラインスタイルやスクリプトの挿入が制限される可能性
2. **動的コンテンツ**: X.comはSPAのため、ページ遷移時にDOMが再構築される
3. **レート制限**: MutationObserverが頻繁に発火するため、デバウンス処理が必須
4. **ファビコンの動的更新**: X.comはファビコンを動的に更新するため、継続的な監視が必要

### 回避策とベストプラクティス
1. **要素の特定**: 複数のセレクターを組み合わせて確実に要素を特定
2. **非破壊的な置換**: 元のDOM構造を可能な限り維持
3. **状態管理**: 拡張機能の有効/無効切り替え時はページリロードで確実にリセット
4. **画像の扱い**: data URLとして保存することで、外部依存を排除

## よくある問題と対処法

### ロゴが置換されない場合
1. セレクターが古い可能性 → content.jsの`logoSelectors`配列を更新
2. 動的に追加される要素 → MutationObserverのデバウンス時間を調整
3. CSPによるブロック → 開発者ツールのコンソールでエラーを確認

### パフォーマンスの問題
1. 過剰な再描画 → デバウンス処理の時間を延長（現在100ms）
2. メモリリーク → MutationObserverの切断処理を追加（現在未実装）

### データの永続性
- `chrome.storage.sync`の制限:
  - 全体で100KB
  - 1つのアイテムで8KB
  - data URLで大きな画像を保存する場合は注意

## デバッグ方法

```javascript
// コンテンツスクリプトのデバッグ
// 1. X Proページで開発者ツールを開く
// 2. Consoleタブでcontent.jsのログを確認

// ポップアップのデバッグ
// 1. 拡張機能アイコンを右クリック→「ポップアップを検証」

// バックグラウンドスクリプトのデバッグ
// 1. chrome://extensions/ で「Service Worker」リンクをクリック
```

## テスト対象URL
- https://x.com/
- https://twitter.com/
- https://pro.x.com/
- https://mobile.x.com/

全てのX/Twitterドメインで動作確認が必要です。特にファビコンの置換が正しく動作することを確認。

## 実装上の制約事項

### Content Security Policy (CSP)
- X.comのCSPにより、インラインスタイルや外部リソースの読み込みに制限がある
- 画像URLはHTTPSである必要がある
- data URLは使用可能（青い鳥画像は拡張機能に同梱）
- ファビコン置換には特別な配慮が必要

### Single Page Application (SPA)対応
- X.comはSPAのため、ページ遷移してもDOMが完全に再構築されない
- MutationObserverで動的に追加される要素（ロゴ、ファビコン）を監視
- パフォーマンスのため100msのdebounceを実装
- ファビコンは特に頻繁に更新されるため要注意

### ストレージ制限
- chrome.storage.syncの制限:
  - 総容量: 100KB
  - 1アイテムあたり: 8KB
  - アップロードした画像のdata URLが大きい場合は注意

## よくある問題と対処法

### ロゴが置換されない場合
1. 開発者ツールでセレクターを確認（X.comのDOM構造が変更された可能性）
2. `content.js`の`replaceLogo`関数にセレクターを追加
3. 拡張機能をリロード（chrome://extensions/）

### ファビコンが置換されない場合
1. 動的に更新されるファビコンのため、MutationObserverで監視が必要
2. `replaceFavicon`関数が正しく動作しているか確認
3. CSPによるブロックがないか開発者ツールで確認

### パフォーマンスの問題
- MutationObserverのcallback内で重い処理を避ける
- debounce時間を調整（現在は100ms）
- 不要なDOM走査を減らす

### 設定が反映されない
- chrome.storage.syncの同期に時間がかかる場合がある
- 手動でページをリロードすることで解決する場合が多い
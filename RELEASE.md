# リリース手順

## 1. 依存関係のインストール

```bash
npm install
```

## 2. コードのLint実行

```bash
# Lintチェック
npm run lint

# 自動修正可能な問題を修正
npm run lint:fix
```

## 3. ビルド

```bash
# Lintとビルドを実行
npm run package

# または個別にビルド
npm run build
```

これにより `dist/x-to-bird-v1.0.0.zip` が作成されます。

## 4. Chrome Web Storeへの公開

### 初回公開

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) にアクセス
2. 「新しいアイテム」をクリック
3. `dist/x-to-bird-v*.zip` をアップロード
4. 必要な情報を入力：
   - **名前**: X to Bird - Bring Back the Blue Bird
   - **概要**: Xのロゴを懐かしい青い鳥に戻すChrome拡張機能
   - **カテゴリ**: ソーシャル＆コミュニケーション
   - **言語**: 日本語、英語
5. スクリーンショットを追加（1280x800または640x400）
6. プライバシーポリシーを設定
7. 公開

### アップデート

1. `manifest.json` のバージョンを更新
2. `package.json` のバージョンも同期
3. ビルド実行: `npm run package`
4. Developer Dashboardでアイテムを選択
5. 「パッケージ」→「新しいパッケージをアップロード」
6. 変更内容を記載して公開

## 5. ローカルテスト

リリース前の最終確認：

1. Chrome で `chrome://extensions/` を開く
2. 既存の開発版をオフまたは削除
3. 「パッケージ化されていない拡張機能を読み込む」
4. `dist/` フォルダ内に解凍したファイルを選択
5. X.com でテスト実行

## 6. チェックリスト

- [ ] manifest.json のバージョン更新
- [ ] package.json のバージョン同期
- [ ] Lintエラーがない
- [ ] 全機能が正常動作
- [ ] 不要なconsole.logを削除
- [ ] READMEが最新
- [ ] アイコンが正しく設定されている

## トラブルシューティング

### Lintエラーが出る場合

```bash
# 自動修正を試す
npm run lint:fix

# 手動で修正が必要な場合はエラーメッセージを確認
npm run lint
```

### ビルドが失敗する場合

```bash
# クリーンビルド
npm run clean
npm install
npm run build
```

# 位置連動広告システム

指定した地点（半径100m）にスマホが近づくと、自動的に広告リンクを表示する仕組みです。

- **PC用管理画面**（[admin/index.html](admin/index.html)）: Google Map をクリックして広告マークを登録・削除
- **スマホ用アプリ**（[app/index.html](app/index.html)）: 起動して位置情報を許可すると、自動で現在地を監視し、登録地点の半径100m以内に入ったら広告リンク＋サムネイルを表示

技術構成: 素の HTML / JavaScript（ビルド不要）+ Firebase Firestore（データ保存・リアルタイム同期）+ Firebase Authentication（管理画面ログイン）+ Google Maps JavaScript API + Vercel（ホスティング）。

---

## 1. Firebase のセットアップ

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. **Firestore Database** を作成（本番モードでOK。リージョンは `asia-northeast1` 推奨）
3. **Authentication** → Sign-in method で「メール/パスワード」を有効化し、管理者用アカウントを1つ作成（例: あなたのメールアドレス）
   - これが `admin/index.html` のログインに使うアカウントです
4. プロジェクトの設定 → 全般 → 「マイアプリ」→ ウェブアプリを追加し、表示された設定値（`apiKey` など）を [shared/firebase.js](shared/firebase.js) の `firebaseConfig` に貼り付け
5. Firestore の「ルール」タブを開き、[firestore.rules](firestore.rules) の内容に置き換えて公開
   - 読み取りは誰でも可（スマホ用アプリはログイン不要で参照する設計）
   - 書き込み（マークの追加・削除）はログイン済みユーザーのみ許可

## 2. Google Maps API のセットアップ

1. [Google Cloud Console](https://console.cloud.google.com/) で「Maps JavaScript API」を有効化
2. APIキーを発行
3. **重要**: キーに「HTTPリファラー制限」をかけ、Vercelの本番ドメイン（例 `your-app.vercel.app/*`）とローカル確認用ドメインのみ許可してください（無制限のキーは第三者に不正利用されます）
4. [admin/index.html](admin/index.html) と [app/index.html](app/index.html) 内の `YOUR_GOOGLE_MAPS_API_KEY` を発行したキーに置き換え

## 3. ローカルでの動作確認

```bash
npm run dev
```

`http://localhost:3000` でPC管理画面（`/admin/`）を確認できます。
※ 位置情報APIは `https` または `localhost` でのみ動作するため、スマホ実機での確認は手順4のVercelデプロイ後に行ってください（同一Wi-Fi内でのローカルIPアクセスでは位置情報が動きません）。

## 4. Vercel へのデプロイ

```bash
npm i -g vercel   # 未インストールの場合
vercel            # プレビューデプロイ
vercel --prod     # 本番デプロイ
```

このプロジェクトは静的ファイルのみなので、Vercel側の特別な設定は不要です（フレームワーク検出: なし/静的サイトのままでOK）。

デプロイ後のURL構成:
- `/` : トップページ（管理画面・スマホアプリへのリンク）
- `/admin/` : PC用マーク管理画面
- `/app/` : スマホ用広告表示アプリ

## 5. 使い方

1. PCで `/admin/` を開き、作成した管理者アカウントでログイン
2. 地図をクリック → タイトル・広告リンクURL・サムネイル画像URL（任意）・動画URL（任意）・半径（初期値100m）を入力して保存
3. スマホで `/app/` を開き、「位置情報を許可して開始」をタップ
4. アプリを開いたまま（画面ON）該当地点の半径100m以内に入ると、自動的に画面下部に広告カードが表示される
   - ホーム画面に追加（PWAインストール）すると、次回からアイコンから直接起動できます

### 動画の自動再生（観光ルート案内などに）

「動画URL」に値を入れておくと、到着時（半径100m以内に入った瞬間）に自動でミュート再生が始まります。

- **YouTubeのURL**（`https://www.youtube.com/watch?v=...` や `https://youtu.be/...`）→ 自動でYouTube埋め込みプレイヤーに変換され、ミュート自動再生。音量操作はプレイヤー内のコントロールから行います。
- **mp4/webm/oggの直リンク**（例: `https://example.com/video.mp4`）→ `<video>` タグでミュート自動再生。カード右下の「🔇 タップで音声ON」をタップすると音声が有効になります。
- どちらの場合も、ブラウザの自動再生ポリシー上「音声ありの自動再生」はできません（ミュート自動再生 → ユーザー操作で音声ON、という2段階が必須です）。
- 動画URLを空にしておけば、従来どおりサムネイル画像＋リンクのみのシンプルなカードになります。

---

## 重要な制限事項（必ずお読みください）

Webアプリ（PWA）の位置情報監視には、OS/ブラウザ側の制約があります。

- **画面表示中・アプリがフォアグラウンドの間のみ確実に動作します。** ブラウザタブを閉じたり、画面をロックしたりすると、位置情報の監視が止まる場合があります。
- **iOS Safari は特にバックグラウンド位置情報の制限が強く**、アプリを閉じた状態での自動検知・通知はほぼ実現できません。
- Android Chrome はホーム画面に追加（PWAインストール）した上で画面を点けたまま持ち歩くことで、比較的安定して動作しますが、それでも完全にアプリを閉じた状態での常時監視は保証されません。
- **「アプリを完全に閉じていても常に自動で広告を配信したい」場合は、Webアプリでは実現が困難です。** iOSの「Significant-Change Location Service」やAndroidの「Foreground Service」を使うネイティブアプリ（Swift/Kotlin、またはReact Native等）の開発が必要になります。その場合は別途ご相談ください。

現状の実装は「アプリを開いている（画面表示中の）間、自動で半径100m判定と広告表示を行う」という、Webでできる範囲での自動化になっています。

---

## ファイル構成

```
map/
├── index.html            # トップページ
├── admin/index.html      # PC用マーク管理画面
├── app/
│   ├── index.html        # スマホ用広告表示アプリ
│   ├── manifest.json     # PWAマニフェスト
│   ├── sw.js              # Service Worker（オフライン起動・PWAインストール用）
│   └── icons/icon.svg
├── shared/
│   ├── firebase.js       # Firebase初期化・共通エクスポート
│   └── geo.js            # 距離計算（Haversine公式）
├── firestore.rules       # Firestoreセキュリティルール
└── package.json
```

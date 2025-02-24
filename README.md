# 音コレ(音楽コレクション)
<!-- プロダクト名に変更してください -->

![音コレ](/image/logo.png)
<!-- プロダクト名・イメージ画像を差し変えてください -->



## チーム名
チーム2 EMM .com (エニアック・マニアック・モノマニアック)
<!-- チームIDとチーム名を入力してください -->


## 背景・課題・解決されること

<!-- テーマ「関西をいい感じに」に対して、考案するプロダクトがどういった(Why)背景から思いついたのか、どのよう(What)な課題があり、どのよう(How)に解決するのかを入力してください -->


## プロダクト説明

<!-- 開発したプロダクトの説明を入力してください -->


## 操作説明・デモ動画
[デモ動画はこちら](https://www.youtube.com/watch?v=fbzGp0XJGq8)
<!-- 開発したプロダクトの操作説明について入力してください。また、操作説明デモ動画があれば、埋め込みやリンクを記載してください -->


## 注力したポイント

<!-- 開発したプロダクトの中で、特に注力して作成した箇所・ポイントについて入力してください -->
### アイデア面

### デザイン面
　曲再生ボタンを連打した際に、SpotifyAPIも連打してしまわないようにボタンに**1秒間のクールタイム**を持たせた。
その一秒間が**不快にならない**ように再生ボタンには**アニメーション**を持たせている。

![play](/image/player.gif)

### その他
　自分の位置と一番近い曲を取得する処理は、地図をブロックに分割し**index**を付与することでMySQLから高速に取得、ローカル側で**KD-tree**を作成し、一秒ごとに一番近い曲を**高速**に取得する。

![map](/image/map.gif)

## 使用技術

- **Next.js**
- SpotifyAPI 曲の再生
- NextAuth SpotifyでOAuth2.0認証
- Leaflet 地図の表示
- prisma ORM
<!-- 使用技術を入力してください -->


<!--
markdownの記法はこちらを参照してください！
https://docs.github.com/ja/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
-->

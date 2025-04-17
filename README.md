# BuonAppetitoBot
## 概要
このBotは、Discordサーバー「ぺぺ鯖: Old Horizons」専用に開発された多機能Botです。サーバー管理のサポートや便利な機能を追加します。
## 主な機能
### Disboard Bump通知
- Disboardのbumpが可能になると、指定されたロールをメンションします。bumpが可能な際にワンボタンで実行できます。
### ウェルカムメッセージ機能
サーバーに新しいユーザーが参加した際に、自動的にウェルカムメッセージを送信します。
### 即抜けRTA (実験的機能)
- サーバー参加後1分以内に退出したユーザーがいた場合に、「即抜けRTA」としてユーザーIDと退出までの時間を記録し、送信する機能です。
注意: 現在デバッグ中にアカウントロックが発生した影響で、一部バグが残っている可能性があります。今後のアップデートで安定化を目指します。
### メッセージ監視機能
- サーバー内のメッセージを監視し、特定の条件に合致するメッセージを検知する機能です。
重要: この機能は、config.json ファイルで設定を有効にしない限り利用できません。
## コマンド
以下のコマンドを使用することで、Botの様々な機能を利用できます。

- `ping`:

  - Botからの応答と、サーバーとの間の遅延時間（ping値）を表示します。Botの稼働状況を確認する際に便利です。
- `avatars`:

  -コマンドを実行したユーザー自身のアイコン、または指定したユーザーのアイコン画像を取得して表示します。
- `settings`:

  - Botの設定を行うためのインタラクティブなメニューを表示します。青色のボタンを通じて、視覚的に設定を変更できます。

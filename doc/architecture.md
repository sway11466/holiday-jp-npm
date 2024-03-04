# アーキテクチャー
ADR(Architecture Decision Record)に近い形でアーキテクチャーを残しておく。

## 祝日CSVを腹持ちする
   - Decision（決定事項）
      - 祝日CSVをリリースパッケージに含む
   - Context（経緯・背景情報）
      - スタンドアローンで動くことを重視
   - Consideration（比較・検討内容）
      - 起動時にCSVを取得しにいく
         - サポート期間が自動更新されるメリットはある
         - インターネット環境が必須になることは、取得元URLを指定可能にすることで回避可能
         - 公開ファイルはSJISなので文字コード変換が必要となる事もあきらめた要因の1つ

## 祝日CSVをUTF8変換する
   - Decision（決定事項）
      - SJISで公開されている祝日CSVをUTF8変換する
   - Context（経緯・背景情報）
      - リリースパッケージは外部ライブラリに依存したくない
      - nodejsはライブラリ無しでSJISを扱えないため開発作業としてUTF8に変換する
      - 将来的にはCSV取得とUTF8変換をGitHubAction等で自動化する
   - Consideration（比較・検討内容）
      - SJISのまま持つ
         - 最新ファイルをそのまま使えるメリットあり
      - SJIS変換ライブラリではなく自前で必要最低限のバイナリ変換で補う
         - 使用される単語が限定的なのでありかもしれないが不毛

## 依存ライブラリ無し
   - Decision（決定事項）
      - リリースパッケージに依存ライブラリは使用しない
   - Context（経緯・背景情報）
      - 趣味の要素が強い
      - ライブラリを軽くしたい
   - Consideration（比較・検討内容）
      - 趣味なので特になし
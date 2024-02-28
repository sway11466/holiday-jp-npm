# holiday-jp-npm
内閣府ホームページの「国民の祝日」について[^1]に記載の祝日を判定するライブラリです。
[^1] https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html

## インストール
```
npm install @sway11466/holiday-jp-npm
```

## 使い方
```
import { useHoliday } from '@sway11466/holiday-jp-npm'
const holiday = useHoliday();
holiday.isHoliday(new Date(2021, 4, 3)); // 2021/5/3 => true
```
exsampleフォルダに他の使い方のサンプルがあるので参照ください。

## トピックス
- 1955年～2025年しか対応していません
  - 内閣府ホームページで公開しているCSVをデータ元としているためです
  - 対応外の日付を指定するとエラーを起こします

## メンテナー向け
- install
```
git clone https://github.com/sway11466/holiday-jp-npm.git
```
- test
```
npm test
```
- publish
```
npm run build
npm publish --access=public
```

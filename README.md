# holiday-jp-npm
内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の祝日を判定するライブラリです。

## インストール
```
npm install @sway11466/holiday-jp-npm
```

## 使い方
- 指定日が祝日であるか判定する
   ```
   import { useHolidayJP } from '@sway11466/holiday-jp-npm'
   const holidayjp = useHolidayJP();
   holidayjp.isHoliday(new Date(2021, 5-1, 3)); // 2021/5/3 => true
   ```
- 指定した条件に当てはまる祝日を取得する（例１）
   ```
   const holidays = holidayjp.get({ year: 2021, month: 5 });
   console.log(holidays.length);  // 3
   console.log(holidays[0].name); // 憲法記念日
   console.log(holidays[0].localDate); // 2021/5/3のDateオブジェクト
   ```
- 指定した条件に当てはまる祝日を取得する（例２）
   ```
   const holidays = holidayjp.get({ year: 2021, name: "スポーツの日" });
   console.log(holidays.length);  // 1
   console.log(holidays[0].localDate); // 2021/7/23のDateオブジェクト（日本オリンピックによる特別対応日）
   ```

## 説明
- 1955年～2025年に対応しています
  - 内閣府ホームページで公開しているデータが2025年までのためです
  - 対応外の日付を指定するとエラーを起こします
- このライブラリは実行環境のタイムゾーンを考慮します
  - isHolidayやgetにDateオブジェクトを指定すると実行環境のタイムゾーンを考慮して判定を行います
- より詳細な情報は[docフォルダ](https://github.com/sway11466/holiday-jp-npm/tree/main/doc)内のドキュメントを参照してください

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

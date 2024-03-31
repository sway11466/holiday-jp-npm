# holiday-jp-npm

内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に基づいて平日や祝日を判定するライブラリです。  
独自の祝日を追加することも可能です。

-   判定ルール
    | 日付の種類 | 判定方法 |
    |------------|----------|
    | 平日 | 週末でも祝日でもない日 |
    | 週末 | 土曜日および日曜日（対象となる曜日は設定で変更可能） |
    | 祝日 | 内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の祝日 |

-   判定の例
    例えば2024年5月は以下のように判定します。
    | 日付の種類 | 5/1(水) | 5/2(木) | 5/3(金) | 5/4(土) | 5/5(日) | 5/6(月) | 5/7(火) |
    |------------|---------|---------|---------|---------|---------|---------|---------|
    | 平日 | 〇 | 〇 | × | × | × | × | 〇 |
    | 週末 | × | × | × | 〇 | 〇 | × | × |
    | 祝日 | × | × | 〇 | 〇 | 〇 | 〇 | × |

## インストール

```
npm install @sway11466/holiday-jp-npm
```

## 使い方

-   初期化
    ```
    import { useHolidayJP } from '@sway11466/holiday-jp-npm'
    const holidayjp = useHolidayJP();
    ```
-   指定日が祝日であるか判定する
    ```
    const ret = holidayjp.isHoliday(new Date(2021, 5-1, 3)); // 2021/5/3 憲法記念日
    console.log(ret); // true
    ```
-   指定日が平日であるか判定する
    ```
    const ret = holidayjp.isWeekday(new Date(2021, 5-1, 7)); // 2021/5/7 平日
    console.log(ret); // true
    ```
-   指定した条件に当てはまる祝日を取得する（例１）
    ```
    const holidays = holidayjp.get({ year: 2021, month: 5 });
    console.log(holidays.length);  // 3
    console.log(holidays[0].name); // 憲法記念日
    console.log(holidays[0].localDate); // 2021/5/3のDateオブジェクト
    ```
-   指定した条件に当てはまる祝日を取得する（例２）
    ```
    const holidays = holidayjp.get({ year: 2021, name: "スポーツの日" });
    console.log(holidays.length);  // 1
    console.log(holidays[0].localDate); // 2021/7/23のDateオブジェクト（日本オリンピックによる特別対応日）
    ```
-   独自の祝日を追加する
    ```
    import { useHolidayJP } from '@sway11466/holiday-jp-npm'
    const additional = [{ name: 'test', year: 2023, month: 3, date: 10, localDate: new Date('2023-03-10T00:00:00+09:00') }]; // 金曜日
    const holidayjp = useHolidayJP({ extends: additional });
    const cond = { year: 2023, month: 3, date: 10 };
    const holiday = holidayjp.isHoliday(cond);
    console.log(ret); // true
    ```

## 説明

-   1955年～2025年に対応しています
    -   内閣府ホームページで公開しているデータに依存しているためです
    -   対応外の日付を指定するとエラーを起こします
-   このライブラリは実行環境のタイムゾーンを考慮して日本時間での祝日判定を行います
-   設定で以下の挙動を変更可能です
    -   対応外の日付を指定した場合のエラー発生有無
    -   タイムゾーン考慮の有無
    -   週末として扱う曜日
    -   独自の祝日の追加
-   より詳細な情報は[docフォルダ](./doc/index.md)内のドキュメントを参照してください

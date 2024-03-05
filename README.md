# holiday-jp-npm

内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の祝日を判定するライブラリです。  
祝日判定だけでなく平日判定機能も持っています。
| 日付の種類 | 判定方法 |
|------------|----------------------------------------------------------------------------------------------------------------|
| 平日 | 週末でも祝日でもない日 |
| 週末 | 土曜日および日曜日（featuer! 設定で変更可能） |
| 祝日 | 内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の祝日 |

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

-   指定日が祝日であるか判定する
    ```
    import { useHolidayJP } from '@sway11466/holiday-jp-npm'
    const holidayjp = useHolidayJP();
    holidayjp.isHoliday(new Date(2021, 5-1, 3)); // 2021/5/3 => true
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

## 説明

-   1955年～2025年に対応しています
    -   内閣府ホームページで公開しているデータが2025年までのためです
    -   対応外の日付を指定するとエラーを起こします（設定で変更可能）
-   このライブラリは実行環境のタイムゾーンを考慮して日本時間での祝日判定を行います
-   より詳細な情報は[docフォルダ](./doc/index.md)内のドキュメントを参照してください

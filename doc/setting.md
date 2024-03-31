# ライブラリの設定

useHolidayJP()の際にパラメーターで動作設定を変えることができます。

```
const holidayjp = useHolidayJP({
    timezoneEffect: true,
    unsupportedDateBehavior: 'error',
    weekend: [0,6],
    extends: [];
});
```

## timezoneEffect

-   is何？
    -   実行環境におけるタイムゾーン補正を行うか否かを設定する
-   デフォルト値
    -   true
-   説明
    -   trueを指定すると、Dateオブジェクトを引数にとる関数は、実行環境のタイムゾーンを考慮してJST日時で処理を行う
    -   falseを指定すると、Dateオブジェクトを引数にとる関数は、値がJST日付という前提でそのまま使用する
    -   もし、ライブラリ呼び出し元でタイムゾーンを考慮した日付を算出している場合はfalseに設定することを検討する（関数呼び出し時の引数にHolidayJP型を使用すれば常にJST日付として処理するため、独自でJST日付を算出している場合はこちらの方法を推奨する）

## unsupportedDateBehavior

-   is何？
    -   サポートされていない日付が指定された場合の挙動を設定する
-   デフォルト値
    -   error
-   設定可能な値
    -   error
    -   ignore
-   説明
    -   サポートされている日付の範囲は内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の通りとなり、おおむね1955年～現在年＋1年である
    -   errorを指定すると、サポート外の日付を指定した場合にエラーが発生する
    -   ignoreを指定すると、サポート外の日付を指定してもエラーになりません、ただし、サポート外の日付には祝日が存在しない前提で動作する

## weekend

-   is何？
    -   週末として扱う曜日を設定する
-   デフォルト値
    -   [0,6]
    -   土曜日と日曜日の意味
-   設定可能な値
    -   0～6の数値
    -   JavaScriptのDate.getDay()に準拠する
    -   0が日曜日、1が月曜日で6が土曜日である

## extends

-   is何？
    -   祝日として扱う日付を追加する
-   デフォルト値
    -   []
    -   なしの意味
-   設定可能な値
    -   HolidayJP型のオブジェクトの配列
-   使用例
    ```
    const additional = [{ name: 'test', year: 2023, month: 3, date: 10, localDate: new Date('2023-03-10T00:00:00+09:00') }];
    const holidayjp = useHolidayJP({ extends: additional });
    ```

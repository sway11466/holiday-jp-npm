# ライブラリの設定

useHolidayJP()の際にパラメーターで動作設定を変えることができます。

```
const holidayjp = useHolidayJP({
    timezoneEffect: true,
    unsupportedDateBehavior: 'error',
    weekend: [0,6],
});
```

## timezoneEffect

-   デフォルト値
    -   true
-   説明
    -   動作環境におけるタイムゾーン補正を行うか否かを設定する
    -   trueを指定すると、Dateオブジェクトを引数にとる関数は、環境のタイムゾーンを考慮したJST日時で処理を行う
    -   falseを指定すると、Dateオブジェクトを引数にとる関数は、値がJST日付という前提でそのまま使用する
    -   もし、ライブラリ呼び出し元でタイムゾーンを考慮した日付を算出している場合はfalseに設定することを検討する
    -   また、関数呼び出し時の引数にDateオブジェクトではなくHolidayJPオブジェクトを使用すれば、この設定による影響をうけずに常にJST日付として動作する

## unsupportedDateBehavior

-   デフォルト値
    -   error
-   設定可能な値
    -   error
    -   ignore
-   説明
    -   サポートされていない日付が指定された場合の挙動を設定する
    -   サポートされている日付の範囲は内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の通りとなり、おおむね1955年～現在年＋1年である
    -   errorを指定すると、サポート外の日付を指定した場合にエラーが発生する
    -   ignoreを指定すると、サポート外の日付を指定してもエラーになりません、ただし、サポート外の日付には祝日が存在しない前提で動作する

## weekend

-   デフォルト値
    -   [0,6]
    -   土曜日と日曜日の意味
-   設定可能な値
    -   0～6の数値
    -   JavaScriptのDate.getDay()に準拠する
    -   0が日曜日、1が月曜日で6が土曜日である
-   説明
    -   週末として扱う曜日を設定する

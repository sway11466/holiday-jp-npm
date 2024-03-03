# ライブラリの設定
useHolidayJP()の際にパラメーターで動作設定を変えることができます。
```
const holidayjp = useHolidayJP({
    timezoneEffect: true
    unsupportedDateBehavior: 'error'
});
```

## timezoneEffect
   - デフォルト値
      - true
   - 説明
      - 動作環境におけるタイムゾーン補正を行うか否かの設定です
      - trueを指定すると、Dateオブジェクトを引数にとる関数は、環境のタイムゾーンを考慮したJST日時で処理を行います
      - falseを指定すると、Dateオブジェクトを引数にとる関数は、値がJST日付という前提でそのまま使用します
      - もし、ライブラリ呼び出し元でタイムゾーンを考慮した日付を算出している場合はfalseに設定することを検討してください
      - また、関数呼び出し時の引数にDateオブジェクトではなくHolidayJPオブジェクトを使用すれば、この設定による影響をうけずに常にJST日付として動作します

## unsupportedDateBehavior
   - デフォルト値
      - error
   - 設定可能な値
      - error
      - ignore
   - 説明
      - サポートされていない日付が指定された場合の挙動を設定します
      - サポートされている日付の範囲は内閣府ホームページの[「国民の祝日」について](https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)に記載の通りとなり、おおむね1955年～現在年＋1年です
      - errorを指定すると、サポート外の日付を指定した場合にエラーが発生します
      - ignoreを指定すると、サポート外の日付を指定してもエラーになりません、ただし、サポート外の日付には祝日が存在しない前提で動作します


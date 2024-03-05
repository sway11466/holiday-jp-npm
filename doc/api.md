# APIドキュメント

HolidayJPのAPI仕様の説明です。

## useHolidayJP

-   パラメーター
    -   （任意）[ライブラリの設定: HolidayJPSetting](setting.md)
-   戻り値
    -   後述のAPIを使用可能なオブジェクト

## all

-   パラメーター
    -   なし
-   戻り値
    -   ライブラリで扱う全ての祝日: HolidayJP[]

## min

-   パラメーター
    -   なし
-   戻り値
    -   ライブラリで扱う最も古い日の祝日: HolidayJP

## max

-   パラメーター
    -   なし
-   戻り値
    -   ライブラリで扱う最も新しい日の祝日: HolidayJP

## setting

-   パラメーター
    -   なし
-   戻り値
    -   ライブラリ設定: HolidayJPSetting
-   説明
    -   ライブラリの動作設定を返す
    -   返す値は設定値のコピーのため変更してもライブラリの動作は変わらない

## createCond

-   パラメーター
    -   日付: Date
-   戻り値
    -   Dateから変換されたHolidayJPCondition: HolidayJPCondition
-   説明
    -   DateオブジェクトをHolidayJPConditionオブジェクトに変換する

## createDate

-   パラメーター
    -   Dateに変換したい値: HolidayJPCondition
-   戻り値
    -   日付: Date
-   説明
    -   HolidayJPConditionオブジェクトをDateオブジェクトに変換する

## isValidDate

-   パラメーター
    -   取得条件: Date or HolidayJPCondition
-   戻り値
    -   存在する日付の場合はtrue
    -   存在しない日付の場合はfalse
-   説明
    -   パラメーターで指定した日付が存在する日付かどうかを検査する

## isSupportDate

-   パラメーター
    -   検査対象の日付: Date or HolidayJPCondition
-   戻り値
    -   サポート対象の日付の場合はtrue
    -   サポート外の日付や以上日の場合はfalse
-   説明
    -   指定した日付がライブラリでサポートされる範囲か否かを検証する

## get

-   パラメーター
    -   取得条件: HolidayJPCondition or Date
-   戻り値
    -   条件に合致した祝日: HolidayJP[]
-   説明
    -   条件に合致する祝日のデータを返す
    -   条件に合致する祝日がない場合には空の配列を返す
    -   サポート外の年の条件を指定した場合の挙動はunsupportedDateBehaviorの設定に応じる
        -   error設定の場合はエラーをthrowする
        -   ignore設定の場合は空の配列を返す

## isHoliday

-   パラメーター
    -   取得条件: HolidayJPCondition or Date
-   戻り値
    -   指定した日付が祝日の場合はtrue
    -   指定した日付が祝日でない場合はfalse
-   説明
    -   指定した日付が祝日の場合にtrueを返す
    -   存在しない日付（例:2021/1/32）を指定した場合にはエラーをthrowする
    -   サポート外の年の条件を指定した場合の挙動はunsupportedDateBehaviorの設定に応じる
        -   error設定の場合はエラーをthrowする
        -   ignore設定の場合はfalsを返す

## isWeekend

-   パラメーター
    -   取得条件: HolidayJPCondition or Date
-   戻り値
    -   指定した日付が週末の場合はtrue
    -   指定した日付が週末でない場合はfalse
-   説明
    -   指定した日付が週末の場合にtrueを返す
    -   祝日の場合も週末であればtrueを返す
    -   週末として扱う曜日は設定で指定可能
        -   デフォルトは土曜日と日曜日
    -   存在しない日付（例:2021/1/32）を指定した場合にはエラーをthrowする
    -   サポート外の年の条件を指定した場合の挙動はunsupportedDateBehaviorの設定に応じる
        -   error設定の場合はエラーをthrowする
        -   ignore設定の場合は通常通り週末を判定して返す

## isWeekday

-   パラメーター
    -   取得条件: HolidayJPCondition or Date
-   戻り値
    -   指定した日付が平日の場合はtrue
    -   指定した日付が平日でない場合はfalse
-   説明
    -   指定した日付が平日の場合にtrueを返す
    -   平日とは週末でも祝日でもない日付のこと
    -   存在しない日付（例:2021/1/32）を指定した場合にはエラーをthrowする
    -   サポート外の年の条件を指定した場合の挙動はunsupportedDateBehaviorの設定に応じる
        -   error設定の場合はエラーをthrowする
        -   ignore設定の場合は週末でなければtrueを返す（サポート外の日付には祝日が存在しない挙動となる）

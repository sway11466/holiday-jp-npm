# APIドキュメント
HolidayJPのAPI仕様の説明です。

## useHolidayJP
   - パラメーター
      - （任意）ライブラリの設定: HolidayJPSetting
   - 戻り値
      - 後述のAPIを使用可能なオブジェクト

## all
   - パラメーター
      - なし
   - 戻り値
      - ライブラリで扱う全ての祝日: HolidayJP[]

## min
   - パラメーター
      - なし
   - 戻り値
      - ライブラリで扱う最も古い日の祝日: HolidayJP

## max
   - パラメーター
      - なし
   - 戻り値
      - ライブラリで扱う最も新しい日の祝日: HolidayJP

## setting
   - パラメーター
      - なし
   - 戻り値
      - ライブラリ設定: HolidayJPSetting
   - 説明
      - ライブラリの動作設定を返却する
      - 返却される値は設定値のコピーのため変更してもライブラリの動作は変わりません

## createCond
(date: Date) => HolidayJPCondition;

## get
   - パラメーター
      - 取得条件: HolidayJPCondition
   - 戻り値
      - 条件に合致した祝日: HolidayJP[]
   - 説明
      - 条件に合致する祝日のデータを返す
      - 条件に合致する祝日がない場合には空の配列を返す
      - サポート外の年の条件を指定した場合にはエラーをthrowする

## isValidDate
   - パラメーター
      - 取得条件: Date or HolidayJPCondition
   - 戻り値
      - 存在する日付の場合はtrue
      - 存在しない日付の場合はfalse
   - 説明
      - パラメーターで指定した日付が存在する日付かどうかを検査する

## isHoliday
   - パラメーター
      - 取得条件: HolidayJPCondition
   - 戻り値
      - 条件に合致した祝日: HolidayJP[]
   - 説明
      - 条件に合致する祝日のデータを返す
      - 条件に合致する祝日がない場合には空の配列を返す
      - 存在しない日付（例：2021/1/32）を指定した場合にはエラーをthrowする
      - サポート外の年の条件を指定した場合にはエラーをthrowする

## isSupportDate
   - パラメーター
      - 検査対象の日付: Date or HolidayJPCondition
   - 戻り値
      - サポート対象の日付の場合はtrue
      - サポート外の日付や以上日の場合はfalse
   - 説明
      - 指定した日付がライブラリでサポートされる範囲か否かを検証する
 
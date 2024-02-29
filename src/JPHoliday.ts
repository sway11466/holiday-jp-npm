/**
 * ライブラリ内で祝日を扱うための型。
 *   - year/month/day
 *     - タイムゾーンAsia/Tokyoでの日付となる
 *   - name
 *     - 日本語での祝日名
 *   - localDate
 *     - スクリプト実行環境のタイムゾーンでの日付
 *     - 時刻は00:00:00となる
 *     - タイムゾーンがJST(Asia/Tokyo)の環境であればyear/month/dayと同じ値となる
 *     - タイムゾーンがUTCの環境であればyear/month/dayの前日の23:00:00となる
 */
export type JPHoliday = {
    year: number;
    month: number;
    day: number;
    name: string;
    localDate: Date;
}

/**
 * ライブラリ内で祝日の抽出条件を指定する。
 *   - year/month/day
 *     - タイムゾーンAsia/Tokyoでの日付となる
 *     - タイムゾーンがUTCの環境での利用時は注意すること（引数にDateを使用するとタイムゾーンを考慮するので使用を検討する）
 *   - name
 *     - 日本語での祝日名
 *     - 完全一致のみ
 */
export type HolidayJPCondition = {
    year?: number;
    month?: number;
    date?: number;
    name?: string;
};

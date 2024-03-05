/**
 * ライブラリの動作設定。
 */
export type HolidayJPSetting = {
    // タイムゾーン変換を行う否かを指定する。デフォルトはtrue。
    timezoneEffect: boolean;
    // サポートされていない日付の挙動を指定する。デフォルトは'error'。
    unsupportedDateBehavior: UnsupportedDateBehavior;
    // 週末として扱う曜日を指定する。値はJavaScriptのDate.getDay()に準拠する。デフォルトは土曜日（6）と日曜日（0）。
    weekend: WeekendSetting[];
};
export type UnsupportedDateBehavior = 'error' | 'ignore';
export type WeekendSetting = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * useHolidayJPに指定するライブラリの動作設定。
 */
export type HolidayJPSettingCond = {
    timezoneEffect?: boolean;
    unsupportedDateBehavior?: UnsupportedDateBehavior;
    weekend?: WeekendSetting[];
};

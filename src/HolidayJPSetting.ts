/**
 * ライブラリの動作設定。
 */
export type HolidayJPSetting = {
    timezoneEffect: boolean; // タイムゾーン変換を行う否かを指定する。デフォルトはtrue。
    unsupportedDateBehavior: UnsupportedDateBehavior; // サポートされていない日付の挙動を指定する。デフォルトは'error'。
};
export type UnsupportedDateBehavior = 'error' | 'ignore';

/**
 * ライブラリの動作設定。
 */
export type HolidayJPSettingCond = {
    timezoneEffect?: boolean; // タイムゾーン変換を行う否かを指定する。デフォルトはtrue。
    unsupportedDateBehavior?: UnsupportedDateBehavior; // サポートされていない日付の挙動を指定する。デフォルトは'error'。
};

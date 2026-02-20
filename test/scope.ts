import { useHolidayJP } from '../src/index';

// テストごとにグローバルストアの設定をデフォルト値に戻す
// ※ extends で追加した祝日データはリセットされないため、グローバルへの extends 追加はこのファイルでは行わない
beforeEach(() => {
    useHolidayJP({ timezoneEffect: true, unsupportedDateBehavior: 'error', weekend: [0, 6] });
});

// --------------------------------
//  scope:'local' の独立性
// --------------------------------

test('[scope] local インスタンスはデフォルト設定で生成される', () => {
    const hp = useHolidayJP({ scope: 'local' });
    expect(hp.setting().timezoneEffect).toBe(true);
    expect(hp.setting().unsupportedDateBehavior).toBe('error');
    expect(hp.setting().weekend).toEqual([0, 6]);
});

test('[scope] local の設定変更がグローバルに影響しない', () => {
    const local = useHolidayJP({ weekend: [1, 2, 3, 4, 5], scope: 'local' });
    const global = useHolidayJP();
    expect(local.setting().weekend).toEqual([1, 2, 3, 4, 5]);
    expect(global.setting().weekend).toEqual([0, 6]);
});

test('[scope] グローバルの設定変更が既存の local インスタンスに影響しない', () => {
    const local = useHolidayJP({ scope: 'local' });
    useHolidayJP({ weekend: [1] }); // グローバルを変更
    expect(local.setting().weekend).toEqual([0, 6]); // local は変更前のまま
});

test('[scope] 2つの local インスタンスは互いに独立している', () => {
    const local1 = useHolidayJP({ weekend: [1], scope: 'local' });
    const local2 = useHolidayJP({ weekend: [2], scope: 'local' });
    expect(local1.setting().weekend).toEqual([1]);
    expect(local2.setting().weekend).toEqual([2]);
});

test('[scope] local の extends がグローバルに影響しない', () => {
    const customHoliday = {
        name: 'カスタム祝日',
        year: 2025,
        month: 3,
        date: 10,
        localDate: new Date('2025-03-10T00:00:00+09:00'),
    };
    const local = useHolidayJP({ extends: [customHoliday], scope: 'local' });
    const global = useHolidayJP();
    expect(local.get({ year: 2025, month: 3, date: 10 })).toHaveLength(1);
    expect(global.get({ year: 2025, month: 3, date: 10 })).toHaveLength(0);
});

test('[scope] local の isWeekend 設定がグローバルに影響しない', () => {
    const local = useHolidayJP({ weekend: [1], scope: 'local' }); // 月曜のみ週末
    const global = useHolidayJP(); // デフォルト [0, 6]
    const monday = new Date('2021-05-10T00:00:00+09:00'); // 月曜
    expect(local.isWeekend(monday)).toBe(true);  // local: 月曜は週末
    expect(global.isWeekend(monday)).toBe(false); // global: 月曜は週末でない
});

test('[scope] local の isHoliday は local の extends のみ参照する', () => {
    const customHoliday = {
        name: 'カスタム祝日',
        year: 2025,
        month: 3,
        date: 10,
        localDate: new Date('2025-03-10T00:00:00+09:00'),
    };
    const local = useHolidayJP({ extends: [customHoliday], scope: 'local' });
    const global = useHolidayJP();
    expect(local.isHoliday({ year: 2025, month: 3, date: 10 })).toBe(true);  // local: 祝日
    expect(global.isHoliday({ year: 2025, month: 3, date: 10 })).toBe(false); // global: 祝日でない
});

// --------------------------------
//  scope:'global'（デフォルト）の動作
// --------------------------------

test('[scope] scope を省略すると global と同じ動作になる', () => {
    useHolidayJP({ weekend: [3] }); // グローバルを変更
    const implicit = useHolidayJP();                    // scope 省略
    const explicit = useHolidayJP({ scope: 'global' }); // scope 明示
    expect(implicit.setting().weekend).toEqual([3]);
    expect(explicit.setting().weekend).toEqual([3]);
});

test('[scope] global インスタンス間で設定が共有される', () => {
    useHolidayJP({ weekend: [5] }); // グローバルに設定
    const global2 = useHolidayJP(); // 別のインスタンスで取得
    expect(global2.setting().weekend).toEqual([5]); // 設定が引き継がれている
});

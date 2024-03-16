import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[isWeekend] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.isWeekend(new Date());
    expect(true);
});

// --------------------------------
//  param section
// --------------------------------

test('[isWeekend] weekend by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date('2021-05-08T00:00:00+09:00'); // 土曜
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(true);
});

test('[isWeekend] weekend by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const weekend = holidayjp.isWeekend({ year: 2021, month: 5, date: 8 }); // 土曜
    expect(weekend).toBe(true);
});

test('[isWeekend] not weekend call by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date('2021-05-10T00:00:00+09:00'); // 平日
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(false);
});

test('[isWeekend] not weekend call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const weekend = holidayjp.isWeekend({ year: 2021, month: 5, date: 10 }); // 平日
    expect(weekend).toBe(false);
});

// --------------------------------
//  invalid param section
// --------------------------------

test('[isWeekend] invalid date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isWeekend(new Date('2021-05-32'));
    }).toThrow();
});

test('[isWeekend] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isWeekend({ year: 2021, month: 5, date: 32 });
    }).toThrow();
});

test('[isWeekend] loss field day by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isWeekend({ year: 2021, month: 5 });
    }).toThrow();
});

// --------------------------------
//  not supported date section
// --------------------------------

test('[isWeekend] older date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = new Date(1954, 1, 1);
        holidayjp.isWeekend(date);
    }).toThrow();
});

test('[isWeekend] older date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: 1954, month: 1, day: 1 };
        holidayjp.isWeekend(date);
    }).toThrow();
});

test('[isWeekend] feature date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const testYear = new Date().getFullYear() + 2;
        const date = new Date(`${testYear}-01-01T00:00:00+09:00`);
        holidayjp.isWeekend(date);
    }).toThrow();
});

test('[isWeekend] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: new Date().getFullYear() + 2, month: 1, day: 1 };
        holidayjp.isWeekend(date);
    }).toThrow();
});

// --------------------------------
//  timezone section
// --------------------------------

test('[isWeekend] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5 - 1, 9, 15, 0, 0); // 2021/5/9 15:00:00 JST
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(true);
});

test('[isWeekend] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5 - 1, 9, 15, 0, 0); // 2021/5/9 15:00:00 UTC => 2021/5/10 00:00:00 JST
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(false);
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[isWeekend] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5 - 1, 9, 15, 0, 0); // 2021/5/9 15:00:00 JST
    const holiday = holidayjp.isWeekend(date);
    expect(holiday).toBe(true);
});

test('[isWeekend] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5 - 1, 9, 15, 0, 0); // 2021/5/9 15:00:00 UTC => 2021/5/10 00:00:00 JST
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(true);
});

// --------------------------------
//  unsupportedDateBehavior section ('ignore' only because default is 'error')
// --------------------------------

test('[isWeekend] unsupportedDateBehavior=ignore older by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = new Date('1954-01-01T00:00:00+09:00'); // 平日
    const weekend = holidayjp.isWeekend(cond);
    expect(weekend).toEqual(false);
});

test('[isWeekend] unsupportedDateBehavior=ignore older by HoidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: 1954, month: 1, date: 1 }; // 平日
    const weekend = holidayjp.isWeekend(cond);
    expect(weekend).toEqual(false);
});

test('[isWeekend]  unsupportedDateBehavior=ignore feature by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const testYear = new Date().getFullYear() + 2;
    const cond = new Date(`${testYear}-01-01T00:00:00+09:00`);
    const weekend = holidayjp.isWeekend(cond);
    expect(weekend).toEqual(cond.getDay() === 0 || cond.getDay() === 6);
});

test('[isWeekend]  unsupportedDateBehavior=ignore feature by HolidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: new Date().getFullYear() + 2, month: 1, date: 1 };
    const jstdate = new Date(`${cond.year}-01-01T00:00:00+09:00`);
    const weekend = holidayjp.isWeekend(cond);
    expect(weekend).toEqual(jstdate.getDay() === 0 || jstdate.getDay() === 6);
});

// --------------------------------
//  WeekendSetting section
// --------------------------------

test('[isWeekend] weekend by Date', () => {
    const holidayjp = useHolidayJP({ weekend: [4] }); // 週末は木曜日のみ
    const date = new Date('2021-05-08T00:00:00+00:00'); // 土曜
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(false);
});

test('[isWeekend] weekend by Date', () => {
    const holidayjp = useHolidayJP({ weekend: [4] }); // 週末は木曜日のみ
    const date = new Date('2021-05-06T00:00:00+00:00'); // 木曜
    console.log(date.toISOString());
    const weekend = holidayjp.isWeekend(date);
    expect(weekend).toBe(true);
});

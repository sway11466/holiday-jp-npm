import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[isWeekday] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.isWeekday(new Date());
    expect(true);
});

// --------------------------------
//  param section
// --------------------------------

test('[isWeekday] weekend by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date("2021-05-07T00:00:00+09:00"); // 平日
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(true);
});

test('[isWeekday] weekend by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekday({ year: 2021, month: 5, day: 7 }); // 平日
    expect(holiday).toBe(true);
});

test('[isWeekday] not weekend call by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date("2021-05-09T00:00:00+09:00"); // 日曜
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(false);
});

test('[isWeekday] not weekend call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekday({ year: 2021, month: 5, day: 9 }); // 日曜
    expect(holiday).toBe(false);
});

// --------------------------------
//  invalid param section
// --------------------------------

test('[isWeekday] invalid date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isWeekday(new Date("2021-05-32"));
    }).toThrow();
});

test('[isWeekday] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isWeekday({ year: 2021, month: 5, day: 32 });
    }).toThrow();
});

test('[isWeekday] loss field day by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isWeekday({ year: 2021, month: 5 });
    }).toThrow();
});

// --------------------------------
//  not supported date section
// --------------------------------

test('[isWeekday] older date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = new Date("1954-01-01T00:00:00+09:00");
        holidayjp.isWeekday(date);
    }).toThrow();
});

test('[isWeekday] older date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: 1954, month: 1, day: 1 };
        holidayjp.isWeekday(date);
    }).toThrow();
});

test('[isWeekday] feature date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const testYear = new Date().getFullYear() + 2;
        const date = new Date(`${testYear}-01-01T00:00:00+09:00`);
        holidayjp.isWeekday(date);
    }).toThrow();
});

test('[isWeekday] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: new Date().getFullYear() + 2, month: 1, day: 1 };
        holidayjp.isWeekday(date);
    }).toThrow();
});

// --------------------------------
//  timezone section
// --------------------------------

test('[isWeekday] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5-1, 7, 15, 0, 0); // 2021/5/7 15:00:00 JST
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(true);
});

test('[isWeekday] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5-1, 7, 15, 0, 0); // 2021/5/7 15:00:00 UTC => 2021/5/8 00:00:00 JST
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(false);
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[isWeekday] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5-1, 7, 15, 0, 0); // 2021/5/7 15:00:00 JST
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(true);
});

test('[isWeekday] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5-1, 7, 15, 0, 0); // 2021/5/7 15:00:00 UTC => 2021/5/8 00:00:00 JST
    const holiday = holidayjp.isWeekday(date);
    expect(holiday).toBe(true);
});

// --------------------------------
//  unsupportedDateBehavior section ('ignore' only because default is 'error')
// --------------------------------

test('[isWeekday] unsupportedDateBehavior=ignore older by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = new Date("1954-01-01T00:00:00+09:00"); // 平日
    const holiday = holidayjp.isWeekday(cond);
    expect(holiday).toEqual(true);
});

test('[isWeekday] unsupportedDateBehavior=ignore older by HoidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: 1954, month: 1, day: 1 }; // 平日
    const holiday = holidayjp.isWeekday(cond);
    expect(holiday).toEqual(true);
});

test('[isWeekday]  unsupportedDateBehavior=ignore feature by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const testYear = new Date().getFullYear() + 2;
    const cond = new Date(`${testYear}-01-01T00:00:00+09:00`);
    const day = (cond.getDay() === 0 || cond.getDay() === 6);
    const holiday = holidayjp.isWeekday(cond);
    expect(holiday).toEqual(!day);
});

test('[isWeekday]  unsupportedDateBehavior=ignore feature by HolidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: new Date().getFullYear() + 2, month: 1, day: 1 };
    const jstdate = new Date(`${cond.year}-01-01T00:00:00+09:00`);
    const day = (jstdate.getDay() === 0 || jstdate.getDay() === 6);
    const holiday = holidayjp.isWeekday(cond);
    expect(holiday).toEqual(!day);
});

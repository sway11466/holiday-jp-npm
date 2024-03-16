import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[isHoliday] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.isHoliday(new Date());
    expect(true);
});

// --------------------------------
//  param section
// --------------------------------

test('[isHoliday] holiday call by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date('2021-05-03T00:00:00+09:00'); // 憲法記念日
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

test('[isHoliday] holiday call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, date: 3 }); // 憲法記念日
    expect(holiday).toBe(true);
});

test('[isHoliday] not holiday call by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date('2021-05-20T00:00:00+09:00'); // 平日
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(false);
});

test('[isHoliday] not holiday call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, date: 20 }); // 平日
    expect(holiday).toBe(false);
});

// --------------------------------
//  invalid param section
// --------------------------------

test('[isHoliday] invalid date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isHoliday(new Date('2021-05-32'));
    }).toThrow();
});

test('[isHoliday] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isHoliday({ year: 2021, month: 5, date: 32 });
    }).toThrow();
});

test('[isHoliday] loss field day by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        holidayjp.isHoliday({ year: 2021, month: 5 });
    }).toThrow();
});

// --------------------------------
//  not supported date section
// --------------------------------

test('[isHoliday] older date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = new Date('1954-01-01T00:00:00+09:00');
        holidayjp.isHoliday(date);
    }).toThrow();
});

test('[isHoliday] older date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: 1954, month: 1, day: 1 };
        holidayjp.isHoliday(date);
    }).toThrow();
});

test('[isHoliday] feature date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const testYear = new Date().getFullYear() + 2;
        const date = new Date(`${testYear}-01-01T00:00:00+09:00`);
        holidayjp.isHoliday(date);
    }).toThrow();
});

test('[isHoliday] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: new Date().getFullYear() + 2, month: 1, day: 1 }; // 2年後の1/1
        holidayjp.isHoliday(date);
    }).toThrow();
});

// --------------------------------
//  timezone section
// --------------------------------

test('[isHoliday] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP();
    const date = new Date(2021, 2 - 1, 11, 15, 0, 0); // 2021/2/11 15:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

test('[isHoliday] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP();
    const date = new Date(2021, 2 - 1, 11, 15, 0, 0); // 2021/2/11 15:00:00 UTC => 2021/2/12 00:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(false);
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[isHoliday] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 2 - 1, 11, 15, 0, 0); // 2021/2/11 15:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

test('[isHoliday] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 2 - 1, 11, 15, 0, 0); // 2021/2/11 15:00:00 UTC => 2021/2/12 00:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

// --------------------------------
//  unsupportedDateBehavior section ('ignore' only because default is 'error')
// --------------------------------

test('[isHoliday] unsupportedDateBehavior=ignore older by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = new Date('1954-01-01T00:00:00+09:00');
    const holiday = holidayjp.isHoliday(cond);
    expect(holiday).toEqual(false);
});

test('[isHoliday] unsupportedDateBehavior=ignore older by HoidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: 1954, month: 1, date: 1 };
    const holiday = holidayjp.isHoliday(cond);
    expect(holiday).toEqual(false);
});

test('[isHoliday]  unsupportedDateBehavior=ignore feature by Date', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const testYear = new Date().getFullYear() + 2;
    const cond = new Date(`${testYear}-01-01T00:00:00+09:00`);
    const holiday = holidayjp.isHoliday(cond);
    expect(holiday).toEqual(false);
});

test('[isHoliday]  unsupportedDateBehavior=ignore feature by HolidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: new Date().getFullYear() + 2, month: 1, date: 1 }; // 2年後の1/1
    const holiday = holidayjp.isHoliday(cond);
    expect(holiday).toEqual(false);
});

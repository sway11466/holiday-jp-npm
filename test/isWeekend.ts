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
    const holiday = holidayjp.isWeekend(new Date(2021, 5-1, 8)); // 2021/5/8
    expect(holiday).toBe(true);
});

test('[isWeekend] weekend by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekend({ year: 2021, month: 5, day: 8 });
    expect(holiday).toBe(true);
});

test('[isWeekend] not weekend call by Date', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekend(new Date(2021, 5-1, 10)); // 2021/5/10
    expect(holiday).toBe(false);
});

test('[isWeekend] not weekend call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekend({ year: 2021, month: 5, day: 10 });
    expect(holiday).toBe(false);
});

// --------------------------------
//  invalid param section
// --------------------------------

test('[isWeekend] invalid date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isWeekend(new Date("2021-05-32"));
    }).toThrow();
});

test('[isWeekend] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isWeekend({ year: 2021, month: 5, day: 32 });
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
        const date = new Date(new Date().getFullYear() + 2,1, 1); // 2年後の1/1
        holidayjp.isWeekend(date);
    }).toThrow();
});

test('[isWeekend] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: new Date().getFullYear() + 2, month: 1, day: 1 }; // 2年後の1/1
        holidayjp.isWeekend(date);
    }).toThrow();
});

// --------------------------------
//  timezone section
// --------------------------------

test('[isWeekend] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5-1, 9, 15, 0, 0); // 2021/5/9 15:00:00 JST
    const holiday = holidayjp.isWeekend(date);
    expect(holiday).toBe(true);
});

test('[isWeekend] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 5-1, 9, 15, 0, 0); // 2021/5/9 15:00:00 UTC => 2021/5/10 00:00:00 JST
    const holiday = holidayjp.isWeekend(date);
    expect(holiday).toBe(false);
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[isWeekend] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5-1, 9, 15, 0, 0); // 2021/5/9 15:00:00 JST
    const holiday = holidayjp.isWeekend(date);
    expect(holiday).toBe(true);
});

test('[isWeekend] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 5-1, 9, 15, 0, 0); // 2021/5/9 15:00:00 UTC => 2021/5/10 00:00:00 JST
    const holiday = holidayjp.isWeekend(date);
    expect(holiday).toBe(true);
});

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
    const holiday = holidayjp.isWeekday(new Date(2021, 5-1, 7)); // 2021/5/7
    expect(holiday).toBe(true);
});

test('[isWeekday] weekend by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekday({ year: 2021, month: 5, day: 7 });
    expect(holiday).toBe(true);
});

test('[isWeekday] not weekend call by Date', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekday(new Date(2021, 5-1, 9)); // 2021/5/9
    expect(holiday).toBe(false);
});

test('[isWeekday] not weekend call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isWeekday({ year: 2021, month: 5, day: 9 });
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
        const date = new Date(1954, 1, 1);
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
        const date = new Date(new Date().getFullYear() + 2,1, 1); // 2年後の1/1
        holidayjp.isWeekday(date);
    }).toThrow();
});

test('[isWeekday] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const date = { year: new Date().getFullYear() + 2, month: 1, day: 1 }; // 2年後の1/1
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

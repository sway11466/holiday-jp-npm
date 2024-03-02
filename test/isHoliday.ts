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
    const holiday = holidayjp.isHoliday(new Date(2021, 5-1, 3)); // 2021/5/3
    expect(holiday).toBe(true);
});

test('[isHoliday] holiday call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, day: 3 });
    expect(holiday).toBe(true);
});

test('[isHoliday] not holiday call by Date', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isHoliday(new Date(2021, 5-1, 20)); // 2021/5/20
    expect(holiday).toBe(false);
});

test('[isHoliday] not holiday call by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, day: 20 });
    expect(holiday).toBe(false);
});

// --------------------------------
//  invalid param section
// --------------------------------

test('[isHoliday] invalid date by Date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isHoliday(new Date("2021-05-32"));
    }).toThrow();
});

test('[isHoliday] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.isHoliday({ year: 2021, month: 5, day: 32 });
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
        const date = new Date(1954, 1, 1);
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
        const date = new Date(new Date().getFullYear() + 2,1, 1); // 2年後の1/1
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
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 2-1, 11, 15, 0, 0); // 2021/2/11 15:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

test('[isHoliday] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 2-1, 11, 15, 0, 0); // 2021/2/11 15:00:00 UTC => 2021/2/12 00:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(false);
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[isHoliday] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 2-1, 11, 15, 0, 0); // 2021/2/11 15:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

test('[isHoliday] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 2-1, 11, 15, 0, 0); // 2021/2/11 15:00:00 UTC => 2021/2/12 00:00:00 JST
    const holiday = holidayjp.isHoliday(date);
    expect(holiday).toBe(true);
});

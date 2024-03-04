import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[get] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.get();
    expect(true);
});
 
// --------------------------------
//  valid param section at HolidayJPCondition
// --------------------------------

test('[get] year param by HolidayJP', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021 });
    expect(holidays.length).toEqual(17);
});

test('[get] month param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5 });
    expect(holidays.length).toEqual(3);
});

test('[get] day param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 });
    expect(holidays.length).toEqual(1);
});

test('[get] name param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ name: '体育の日' });
    expect(holidays.length).toEqual(53);
});

test('[get] year and name param', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.get({ year: 2021, name: 'スポーツの日' });
    expect(holiday.length).toEqual(1);
    expect(holiday[0].year).toEqual(2021);
    expect(holiday[0].month).toEqual(7);
    expect(holiday[0].day).toEqual(23);
});

test('[get] no result param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 10 });
    expect(holidays.length).toEqual(0);
});
 
// --------------------------------
//  valid param section at Date
// --------------------------------
// feature not implemented

// --------------------------------
//  invalid param section at HolidayJP
// --------------------------------

test('[get] invalid date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const cond = { year: 2001, month: 1, day: 32 };
    const holiday = holidayjp.get(cond);
    expect(holiday.length).toEqual(0);
});

test('[get] older date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const cond = { year: 1954, month: 1, day: 1 };
        holidayjp.get(cond);
    }).toThrow();
});

test('[get] feature date by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
        const cond = { year: new Date().getFullYear()+2, month: 1, day: 1 }; // 2年後の1/1
        holidayjp.get(cond);
    }).toThrow();
});

// invalid test at Date

// --------------------------------
//  timezone section
// --------------------------------

test('[get] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 });
    // JEST&timezone-mockではテストを行った時刻によってDate.getDate()で得られる時刻が一定ではない。
    // このためISOStringで検査する。
    expect(holidays[0].localDate.toISOString()).toEqual("2021-05-02T15:00:00.000Z");
});

test('[get] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 });
    // JEST&timezone-mockではテストを行った時刻によってDate.getDate()で得られる時刻が一定ではない。
    // このためISOStringで検査する。
    expect(holidays[0].localDate.toISOString()).toEqual("2021-05-02T15:00:00.000Z");
});

// --------------------------------
//  timezoneEffect section (false only because default is true)
// --------------------------------

test('[get] timezoneEffect=false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 });
    // JEST&timezone-mockではテストを行った時刻によってDate.getDate()で得られる時刻が一定ではない。
    // このためISOStringで検査する。
    expect(holidays[0].localDate.toISOString()).toEqual("2021-05-02T15:00:00.000Z");
});

test('[get] timezoneEffect=false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 });
    // JEST&timezone-mockではテストを行った時刻によってDate.getDate()で得られる時刻が一定ではない。
    // このためISOStringで検査する。
    expect(holidays[0].localDate.toISOString()).toEqual("2021-05-02T15:00:00.000Z");
});

// --------------------------------
//  unsupportedDateBehavior section ('ignore' only because default is 'error')
// --------------------------------

test('[get] unsupportedDateBehavior=ignore older by HolidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: 1954, month: 1, day: 1 };
    const holiday = holidayjp.get(cond);
    expect(holiday.length).toEqual(0);
});

test('[get]  unsupportedDateBehavior=ignore feature by HolidayCondition', () => {
    const holidayjp = useHolidayJP({ unsupportedDateBehavior: 'ignore' });
    const cond = { year: new Date().getFullYear()+2, month: 1, day: 1 }; // 2年後の1/1
    const holiday = holidayjp.get(cond);
    expect(holiday.length).toEqual(0);
});

// invalid test at Date

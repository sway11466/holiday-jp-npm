import { useHolidayJP } from '../src/index';

test('[isValidDate] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.isValidDate(new Date());
    expect(true);
});

// --------------------------------
//  valid section
// --------------------------------

test('[isValidDate] valid by Date', () => {
    const holidayjp = useHolidayJP();
    const date = new Date("2021-05-03T00:00:00+09:00"); // 憲法記念日
    const valid = holidayjp.isValidDate(date);
    expect(valid).toBe(true);
});

test('[isValidDate] valid by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isValidDate({ year: 2021, month: 5, day: 3 });
    expect(holiday).toBe(true);
});

// --------------------------------
//  invalid date section
// --------------------------------

test('[isValidDate] invalid by Date', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isValidDate(new Date("2021-01-32"));
    expect(holiday).toBe(false);
});

test('[isValidDate] invalid by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isValidDate({ year: 2021, month: 1, day: 32 });
    expect(holiday).toBe(false);
});

// --------------------------------
//  loss field section
// --------------------------------

test('[isValidDate] loss field by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.isValidDate({ year: 2021, month: 1 });
    expect(holiday).toBe(false);
});

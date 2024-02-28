import { HolidayCondition } from '../src/HolidayCondition';
import { Holiday, useHoliday } from '../src/index';

test('[get] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.get();
    expect(true);
});

test('[get] year param', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.get({ year: 2021 } as HolidayCondition);
    expect(holidays.length).toEqual(17);
});

test('[get] month param', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.get({ year: 2021, month: 5 } as HolidayCondition);
    expect(holidays.length).toEqual(3);
});

test('[get] day param', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 } as HolidayCondition);
    expect(holidays.length).toEqual(1);
});

test('[get] name param', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.get({ name: '体育の日' } as HolidayCondition);
    expect(holidays.length).toEqual(53);
});

test('[get] year and name param', () => {
    const holidayjp = useHoliday();
    const holiday = holidayjp.get({ year: 2021, name: 'スポーツの日' } as HolidayCondition);
    expect(holiday.length).toEqual(1);
    expect(holiday[0].year).toEqual(2021);
    expect(holiday[0].month).toEqual(7);
    expect(holiday[0].day).toEqual(23);
});

test('[get] no result param', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 10 } as HolidayCondition);
    expect(holidays.length).toEqual(0);
});

test('[get] throw not support day error by HolidayCondition', () => {
    const holidayjp = useHoliday();
    expect(() => {
         holidayjp.get({ year: new Date().getFullYear()+2, month: 1, day: 1 }); // 2年後の1/1
    }).toThrow();
});

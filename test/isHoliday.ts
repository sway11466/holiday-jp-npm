import { HolidayCondition } from '../src/HolidayCondition';
import { Holiday, useHoliday } from '../src/index';

test('[isHoliday] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.isHoliday(new Date());
    expect(true);
});

test('[isHoliday] holiday call by Date', () => {
    const holidayjp = useHoliday();
    const holiday = holidayjp.isHoliday(new Date(2021, 4, 3)); // 2021/5/3
    expect(holiday).toBe(true);
});

test('[isHoliday] not holiday call by Date', () => {
    const holidayjp = useHoliday();
    const holiday = holidayjp.isHoliday(new Date(2021, 4, 20)); // 2021/5/20
    expect(holiday).toBe(false);
});

test('[isHoliday] holiday call by HolidayCondition', () => {
    const holidayjp = useHoliday();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, day: 3 });
    expect(holiday).toBe(true);
});

test('[isHoliday] not holiday call by HolidayCondition', () => {
    const holidayjp = useHoliday();
    const holiday = holidayjp.isHoliday({ year: 2021, month: 5, day: 20 });
    expect(holiday).toBe(false);
});

test('[isHoliday] throw not valid date error by HolidayCondition', () => {
    const holidayjp = useHoliday();
    expect(() => {
         holidayjp.isHoliday({ year: 2021, month: 5 });
    }).toThrow();
});

test('[isHoliday] throw not support day error by HolidayCondition', () => {
    const holidayjp = useHoliday();
    expect(() => {
         holidayjp.isHoliday({ year: new Date().getFullYear()+2, month: 1, day: 1 }); // 2年後の1/1
    }).toThrow();
});

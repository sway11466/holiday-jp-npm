import { HolidayCondition } from '../src/HolidayCondition';
import { Holiday, useHoliday } from '../src/index';

test('[isHoliday] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.isSupportDate(new Date());
    expect(true);
});

test('[isSupportDate] support day call by Date', () => {
    const holidayjp = useHoliday();
    const isSupportRet = holidayjp.isSupportDate(new Date());
    expect(isSupportRet).toBe(true);
});

test('[isSupportDate] not support older day call by Date', () => {
    const holidayjp = useHoliday();
    const isSupportRet = holidayjp.isSupportDate(new Date(1954, 4, 20)); // 1954/5/20
    expect(isSupportRet).toBe(false);
});

test('[isSupportDate] not support feature day call by Date', () => {
    const holidayjp = useHoliday();
    const isSupportRet = holidayjp.isSupportDate(new Date(new Date().getFullYear()+2, 1, 1)); // 2年後の1/1
    expect(isSupportRet).toBe(false);
});

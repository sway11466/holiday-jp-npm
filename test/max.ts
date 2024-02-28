import { Holiday, useHoliday } from '../src/index';

test('[max] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.max();
    expect(true);
});

test('[max] valid data', () => {
    const nowYear = new Date().getFullYear();
    const holidayjp = useHoliday();
    const holiday = holidayjp.max();
    expect(holiday.year).toEqual(nowYear + 1);
});

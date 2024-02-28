import { Holiday, useHoliday } from '../src/index';

test('[all] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.all();
    expect(true);
});

test('[all] exists data', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.all();
    expect(holidays.length).toBeGreaterThan(0);
});

import { Holiday, useHoliday } from '../src/index';

test('[call] basic call', () => {
    const holidayjp = useHoliday();
    holidayjp.all();
    expect(true);
});

test('[call] exists data', () => {
    const holidayjp = useHoliday();
    const holidays = holidayjp.all();
    expect(holidays.length).toBeGreaterThan(0);
});

import { useHolidayJP } from '../src/index';

test('[all] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.all();
    expect(true);
});

test('[all] exists data', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.all();
    expect(holidays.length).toBeGreaterThan(0);
});

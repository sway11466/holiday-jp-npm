import { useHolidayJP } from '../src/index';

test('[max] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.max();
    expect(true);
});

test('[max] valid data', () => {
    const nowYear = new Date().getFullYear();
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.max();
    expect(holiday.year).toEqual(nowYear + 1);
});

import { Holiday, useHolidayJP } from '../src/index';

test('[min] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.min();
    expect(true);
});

test('[min] valid data', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.min();
    expect(holiday.year).toEqual(1955);
    expect(holiday.month).toEqual(1);
    expect(holiday.day).toEqual(1);
});

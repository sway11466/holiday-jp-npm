import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[createDate] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.createDate({ year: 2021, month: 1, day: 11 });
    expect(true);
});

// --------------------------------
//  timezone section
// --------------------------------

test('[createDate] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP();
    const date = holidayjp.createDate({ year: 2021, month: 1, day: 11 });
    expect(date.getFullYear()).toBe(2021);
    expect(date.getMonth()).toBe(1-1);
    expect(date.getDate()).toBe(11);
});

test('[createDate] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP();
    const date = holidayjp.createDate({ year: 2021, month: 1, day: 11 });
    expect(date.getFullYear()).toBe(2021);
    expect(date.getMonth()).toBe(1-1);
    expect(date.getDate()).toBe(10);
});

// --------------------------------
//  invalid date
// --------------------------------

test('[createDate] invalid date', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.createDate({ year: 2021, month: 5, day: 32 });
    }).toThrow();
});

test('[createDate] loss field', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.createDate({ year: 2021, month: 5 });
    }).toThrow();
});

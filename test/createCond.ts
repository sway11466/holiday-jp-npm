import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[createCond] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.createCond(new Date());
    expect(true);
});

test('[createCond] call in jst', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP();
    const date = new Date();
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(date.getFullYear());
    expect(cond.month).toBe(date.getMonth() + 1);
    expect(cond.day).toBe(date.getDate());
});

test('[createCond] call in utc', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP();
    const date = new Date(2023, 11, 31, 15, 0 ,0 ,0); // JSTでは2024/1/1
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2024);
    expect(cond.month).toBe(1);
    expect(cond.day).toBe(1);
});

import timezoneMock from 'timezone-mock';
import { useHolidayJP } from '../src/index';

test('[createCond] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.createCond(new Date());
    expect(true);
});

// --------------------------------
//  timezone test section
// --------------------------------

test('[createCond] timezone is JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP();
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(11);
});

test('[createCond] timezone is UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP();
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 UTC => 2021/1/12 00:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(12);
});

// --------------------------------
//  setting.timezoneEffect test section
// --------------------------------

test('[createCond] setting.timezoneEffect true on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(11);
});

test('[createCond] setting.timezoneEffect false on JST', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(11);
});

test('[createCond] setting.timezoneEffect true on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: true });
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 UTC => 2021/1/12 00:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(12);
});

test('[createCond] setting.timezoneEffect false on UTC', () => {
    timezoneMock.register('UTC');
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const date = new Date(2021, 1 - 1, 11, 15, 0, 0); // 2021/1/11 15:00:00 UTC => 2021/1/12 00:00:00 JST
    const cond = holidayjp.createCond(date);
    expect(cond.year).toBe(2021);
    expect(cond.month).toBe(1);
    expect(cond.date).toBe(11);
});

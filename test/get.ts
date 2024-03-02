import timezoneMock from 'timezone-mock';
import { HolidayJPCondition } from '../src/HolidayJPCondition';
import { useHolidayJP } from '../src/index';

test('[get] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.get();
    expect(true);
});
 
// --------------------------------
// valid param test section at HolidayJP
// --------------------------------

test('[get] year param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021 } as HolidayJPCondition);
    expect(holidays.length).toEqual(17);
});

test('[get] month param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5 } as HolidayJPCondition);
    expect(holidays.length).toEqual(3);
});

test('[get] day param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 } as HolidayJPCondition);
    expect(holidays.length).toEqual(1);
});

test('[get] name param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ name: '体育の日' } as HolidayJPCondition);
    expect(holidays.length).toEqual(53);
});

test('[get] year and name param', () => {
    const holidayjp = useHolidayJP();
    const holiday = holidayjp.get({ year: 2021, name: 'スポーツの日' } as HolidayJPCondition);
    expect(holiday.length).toEqual(1);
    expect(holiday[0].year).toEqual(2021);
    expect(holiday[0].month).toEqual(7);
    expect(holiday[0].day).toEqual(23);
});

test('[get] no result param', () => {
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 10 } as HolidayJPCondition);
    expect(holidays.length).toEqual(0);
});
 
// --------------------------------
// valid param test section at Date
// --------------------------------
// feature not implemented

// --------------------------------
// invalid param test section at HolidayJP
// --------------------------------

test('[get] throw not support day error by HolidayCondition', () => {
    const holidayjp = useHolidayJP();
    expect(() => {
         holidayjp.get({ year: new Date().getFullYear()+2, month: 1, day: 1 }); // 2年後の1/1
    }).toThrow();
});

// --------------------------------
// invalid param test section at Date
// --------------------------------
// feature not implemented

// --------------------------------
// timezone test section
// --------------------------------

test('[get] timezone JSt', () => {
    timezoneMock.register('Etc/GMT-9'); // 'JST'や'Asia/Tokyo'に対応してないためGMT-9を指定
    console.log(new Date().getTimezoneOffset());
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 } as HolidayJPCondition);
    expect(holidays[0].localDate.getFullYear()).toEqual(2021);
    expect(holidays[0].localDate.getMonth()).toEqual(5-1);
    expect(holidays[0].localDate.getDate()).toEqual(3);
});

test('[get] timezone UTC', () => {
    timezoneMock.register('UTC');
    console.log(new Date().getTimezoneOffset());
    const holidayjp = useHolidayJP();
    const holidays = holidayjp.get({ year: 2021, month: 5, day: 3 } as HolidayJPCondition);
    expect(holidays[0].localDate.getFullYear()).toEqual(2021);
    expect(holidays[0].localDate.getMonth()).toEqual(5-1);
    expect(holidays[0].localDate.getDate()).toEqual(2);
});

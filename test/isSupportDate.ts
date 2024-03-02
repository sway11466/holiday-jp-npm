import { useHolidayJP } from '../src/index';

test('[isHoliday] basic call', () => {
    const holidayjp = useHolidayJP();
    holidayjp.isSupportDate(new Date());
    expect(true);
});

// --------------------------------
//  valid date section
// --------------------------------

test('[isSupportDate] support day call by Date', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate(new Date());
    expect(isSupportRet).toBe(true);
});

test('[isSupportDate] support day call by HolidayJPCondition', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate({ year: 2021, month: 1, day: 10 });
    expect(isSupportRet).toBe(true);
});

// --------------------------------
//  invalid date section
// --------------------------------

test('[isSupportDate] invalid day call by Date', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate(new Date("2021-01-32"));
    expect(isSupportRet).toBe(true);
});

test('[isSupportDate] invalid day call by HolidayJPCondition', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate({ year: 2021, month: 1, day: 32 });
    expect(isSupportRet).toBe(true);
});

// --------------------------------
//  older day section
// --------------------------------

test('[isSupportDate] older day call by Date', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate(new Date(1954, 1-1, 1)); // 1954/1/1
    expect(isSupportRet).toBe(false);
});

test('[isSupportDate] older day call by HolidayJPCondition', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate({ year:1954, month: 1, day: 1 }); // 1954/5/20
    expect(isSupportRet).toBe(false);
});

// --------------------------------
//  feature day section
// --------------------------------

test('[isSupportDate] feature day call by Date', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate(new Date(new Date().getFullYear()+2, 1, 1)); // 2年後の1/1
    expect(isSupportRet).toBe(false);
});

test('[isSupportDate] feature day call by HolidayJPCOndition', () => {
    const holidayjp = useHolidayJP();
    const isSupportRet = holidayjp.isSupportDate({ year: new Date().getFullYear()+2, month: 1, day: 1 }); // 2年後の1/1
    expect(isSupportRet).toBe(false);
});

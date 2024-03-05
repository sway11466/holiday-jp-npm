import { useHolidayJP } from '../src/index';

test('[setting] basic call', () => {
    useHolidayJP();
    expect(true);
});

test('[setting] default setting', () => {
    const holidayjp = useHolidayJP();
    const setting = holidayjp.setting();
    expect(setting.timezoneEffect).toBe(true);
});

test('[setting] timezoneEffect setting to false', () => {
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const setting = holidayjp.setting();
    expect(setting.timezoneEffect).toBe(false);
});

test('[setting] change setting', () => {
    const holidayjp = useHolidayJP({ timezoneEffect: false });
    const setting = holidayjp.setting();
    setting.timezoneEffect = true;
    expect(holidayjp.setting().timezoneEffect).toBe(false);
});

import { HolidayJP } from "./HolidayJP";
import { HolidayJPSetting } from "./HolidayJPSetting";

/**
 * 祝日の型情報。
 * キーは年。値はキーに対応したHoliday型の値の配列。 
 */
export type HolidayJPStore = {
    holiday: { [year: number]: HolidayJP[] }
    setting: HolidayJPSetting
}

import { Holiday } from "./Holiday";

/**
 * 祝日の型情報。
 * キーは年。値はキーに対応したHoliday型の値の配列。 
 */
export type HolidayStore = {
    [year: number]: Holiday[];
}

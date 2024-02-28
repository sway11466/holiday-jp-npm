import { Holiday } from "./Holiday";

/**
 * 祝日の型情報
 */
export type HolidayStore = {
    [year: string]: Holiday[];
}

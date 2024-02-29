import fs from 'fs';
import path from 'path';
import { JPHoliday } from './JPHoliday';
import { JPHolidayCondition } from './JPHolidayCondition';
import { HolidayStore } from './HolidayStore';

/**
 * 引数で指定したDateオブジェクトの日本タイムゾーンでの日付を返す。時刻は00:00:00となる。
 */
const getJPTimeZoneDateFromDate = (date: Date) => {
    const JPDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (9 * 60 * 60 * 1000));
    return new Date(JPDate.getFullYear(), JPDate.getMonth(), JPDate.getDate());
}

/**
 * 内閣府公開の休日のデータを読み込む。
 * 
 * @see https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
 * @see https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv
 */
const store: HolidayStore = (() => {
    const store: HolidayStore = {};
    const csvPath = path.join(path.dirname(__filename), 'syukujitsu.csv');
    fs.readFileSync(csvPath).toString().split('\r\n').forEach((value) => {
        if (!value.match(/\d+\/\d+\/\d+/)) { return; } // ヘッダーと空行を除く
        const [date, name] = value.split(',');
        const [year, month, day] = date.split('/');
        if (store[Number(year)] === undefined) {
            store[Number(year)] = [];
        }
        store[Number(year)].push({
            year: Number(year),
            month: Number(month),
            day: Number(day),
            name: name,
            localDate: getJPTimeZoneDateFromDate(new Date(Number(year), Number(month) - 1, Number(day))),
        }); 
    });
    return store;
})();

/**
 * 祝日を扱う機能を返却する。
 * 
 * @returns 
 */
function useHolidayJP() {

    /**
     * すべての祝日のデータを返す。
     */
    const all = () => {
        return Object.values(store).flat();
    };

    /**
     * 最も過去の祝日のデータを返す。
     */
    const min = () => {
        const years = Object.keys(store).map(value => Number(value));
        return store[Math.min(...years)][0];
    };

    /**
     * 最も未来の祝日のデータを返す。
     */
    const max = () => {
        const years = Object.keys(store).map(value => Number(value));
        const holiday = store[Math.max(...years)];
        return holiday[holiday.length - 1];
    };

    /**
     * 引数で指定したdateオブジェクトから JPHolidayCondition を生成して返却する。
     */
    const createCond = (date: Date): JPHolidayCondition => {
        const jpDate = getJPTimeZoneDateFromDate(date);
        return {
            year: jpDate.getFullYear(),
            month: jpDate.getMonth() + 1,
            day: jpDate.getDate()
        };
    }

    /**
     * 条件に合致する祝日のデータを返す。
     * 条件に合致する祝日がない場合には空の配列を返す。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     * @todo date型も受け取れるようにする
     */
    const get = (cond?: JPHolidayCondition) => {
        if (cond === null || cond === undefined) {
            return all();
        }
        if (!isSupportDate(cond)) {
            throw new Error('[@sway11466/holyday-jp error] not supported date.');
        }
        const holiday = (cond.year) ? store[cond.year] : all();
        return holiday.filter((value) => {
            return (cond.month === undefined || value.month === cond.month) &&
                (cond.day === undefined || value.day === cond.day) &&
                (cond.name === undefined || value.name === cond.name);
        });
    };

    /**
     * 指定した日付が祝日の場合にtrueを返す。
     * 祝日でない場合にはfalseを返す。
     * HolidayConditionを指定した場合にはyear/month/dayの指定が必須となる。指定が不足する場合はErrorをthrowする。nameは無視される。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     */
    const isHoliday = (cond: Date | JPHolidayCondition) => {
        return isHolidayImpl((cond instanceof Date) ? createCond(cond) : cond);
    };
    const isHolidayImpl = (cond: JPHolidayCondition) => {
        if (!isSupportDateImpl(cond)) {
            throw new Error('[@sway11466/holyday-jp error] not supported date.');
        }
        if (cond.year === undefined || cond.month === undefined || cond.day === undefined) {
            throw new Error('[@sway11466/holyday-jp error] year, month, day is required');
        }
        return get(cond).length > 0;
    };

    /**
     * 指定した日付がサポート対象の年の場合にtrueを返す。
     */
    const isSupportDate = (cond: Date | JPHolidayCondition) => {
        return isSupportDateImpl((cond instanceof Date) ? createCond(cond) : cond);
    };
    const isSupportDateImpl = (cond: JPHolidayCondition) => {
        if (!cond.year) { return true; }
        return min().year <= cond.year && cond.year <= max().year;
    };

    return { all, min, max, createCond, get, isHoliday, isSupportDate };
}

export { useHolidayJP };
export { JPHoliday as Holiday, JPHolidayCondition as HolidayCondition, HolidayStore };

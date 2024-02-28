import fs from 'fs';
import path from 'path';
import { Holiday } from './Holiday';
import { HolidayCondition } from './HolidayCondition';
import { HolidayStore } from './HolidayStore';

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
        }); 
    });
    return store;
})();

/**
 * 祝日を扱う機能を返却する。
 * 
 * @returns 
 */
const useHoliday = () => {

    /**
     * すべての祝日のデータを返す。
     */
    const all = () => {
        return Object.values(store).flat();
    }

    /**
     * 最も過去の祝日のデータを返す。
     */
    const min = () => {
        const years = Object.keys(store).map(value => Number(value));
        return store[Math.min(...years)][0];
    }

    /**
     * 最も未来の祝日のデータを返す。
     */
    const max = () => {
        const years = Object.keys(store).map(value => Number(value));
        const holiday = store[Math.max(...years)];
        return holiday[holiday.length - 1];
    }

    /**
     * 条件に合致する祝日のデータを返す。
     * 条件に合致する祝日がない場合には空の配列を返す。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     * @todo date型も受け取れるようにする
     */
    const get = (cond?: HolidayCondition) => {
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
    }

    /**
     * 指定した日付が祝日の場合にtrueを返す。
     * 祝日でない場合にはfalseを返す。
     * HolidayConditionを指定した場合にはyear/month/dayの指定が必須となる。指定が不足する場合はErrorをthrowする。nameは無視される。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     */
    const isHoliday = (cond: Date | HolidayCondition) => {
        if (cond instanceof Date) {
            return isHolidayByDate(cond);
        } else {
            return isHolidayByHolidayConditon(cond);
        }
    }
    const isHolidayByDate = (cond: Date) => {
        const year = cond.getFullYear();
        const month = cond.getMonth() + 1;
        const day = cond.getDate();
        return isHolidayByHolidayConditon({ year, month, day});
    }
    const isHolidayByHolidayConditon = (cond: HolidayCondition) => {
        if (!isSupportDateByHolidayConditon(cond)) {
            throw new Error('[@sway11466/holyday-jp error] not supported date.');
        }
        if (cond.year === undefined || cond.month === undefined || cond.day === undefined) {
            throw new Error('[@sway11466/holyday-jp error] year, month, day is required');
        }
        return get(cond).length > 0;
    }

    /**
     * 指定した日付がサポート対象の年の場合にtrueを返す。
     */
    const isSupportDate = (cond: Date | HolidayCondition) => {
        if (cond instanceof Date) {
            return isSupportDateByDate(cond);
        } else {
            return isSupportDateByHolidayConditon(cond);
        }
    }
    const isSupportDateByDate = (cond: Date) => {
        const year = cond.getFullYear();
        return isSupportDateByHolidayConditon({ year });
    }
    const isSupportDateByHolidayConditon = (cond: HolidayCondition) => {
        if (!cond.year) { return true; }
        return min().year <= cond.year && cond.year <= max().year;
    }

    return { all, min, max, get, isHoliday, isSupportDate };
}

export { Holiday, useHoliday };

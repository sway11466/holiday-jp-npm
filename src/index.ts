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
    const rs = fs.readFileSync(csvPath);
    const line = rs.toString().split('\r\n');
    line.shift(); // ヘッダーを取り除く
    line.forEach((value) => {
        const [date, name] = value.split(',');
        const [year, month, day] = date.split('/');
        if (store[year] === undefined) {
            store[year] = [];
        }
        store[year].push({
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
     * 条件に合致する祝日のデータを返す。
     * 条件に合致する祝日がない場合には空の配列を返す。
     * 
     * @todo date型も受け取れるようにする
     * @param cond 
     * @returns 
     */
    const get = (cond?: HolidayCondition) => {
        if (cond === null || cond === undefined) {
            return all();
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
     * 
     * @param date 
     * @returns 
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
        if (cond.year === undefined || cond.month === undefined || cond.day === undefined) {
            throw new Error('[@sway11466/holyday-jp error] year, month, day is required');
        }
        return get(cond).length > 0;
    }

    return { all, get, isHoliday };
}

export { Holiday, useHoliday };

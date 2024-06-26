import fs from 'fs';
import path from 'path';
import { HolidayJP } from './HolidayJP';
import { HolidayJPCondition } from './HolidayJPCondition';
import { HolidayJPStore } from './HolidayJPStore';
import { HolidayJPSetting, HolidayJPSettingCond } from './HolidayJPSetting';

/**
 * デフォルトのライブラリ動作設定を生成する。
 */
const createDefaultStoreSetting = (): HolidayJPSetting => {
    return {
        timezoneEffect: true,
        unsupportedDateBehavior: 'error',
        weekend: [0, 6],
        extends: [],
    };
};

/**
 * 引数で指定したyear/month/dateをJST日付とみなして、タイムゾーンを考慮したDateオブジェクトを生成する。時刻は00:00:00となる。
 */
const initLocalDate = (year: number, month: number, date: number) => {
    const fillYear = String(year);
    const fillMonth = String(month).padStart(2, '0');
    const fillDate = String(date).padStart(2, '0');
    const isoString = `${fillYear}-${fillMonth}-${fillDate}T00:00:00+09:00`;
    return new Date(isoString);
};

/**
 * 内閣府公開の休日のデータを読み込む。
 *
 * @see https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
 * @see https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv
 */
const store: HolidayJPStore = (() => {
    const store: HolidayJPStore = { holiday: {}, setting: createDefaultStoreSetting() };
    const csvPath = path.join(path.dirname(__filename), 'syukujitsu.csv');
    fs.readFileSync(csvPath)
        .toString()
        .split('\n')
        .forEach((value) => {
            // ヘッダーと空行を除く
            if (!value.match(/\d+\/\d+\/\d+/)) {
                return;
            }
            const [fulldate, name] = value.split(',');
            const [year, month, date] = fulldate.split('/').map((value) => Number(value));
            if (store.holiday[year] === undefined) {
                store.holiday[year] = [];
            }
            store.holiday[year].push({
                year,
                month,
                date,
                name,
                localDate: initLocalDate(year, month, date),
            });
        });
    return store;
})();

/**
 * 祝日を扱う機能を返す。
 *
 * @returns
 */
const useHolidayJP = (initSetting?: HolidayJPSettingCond) => {
    /**
     * 設定を反映する。
     */
    ((setting) => {
        if (setting === undefined) {
            return;
        }
        Object.assign(store.setting, structuredClone(setting));
        if (setting.extends) {
            setting.extends.forEach((holiday) => store.holiday[holiday.year].push(holiday));
        }
    })(initSetting);

    /**
     * すべての祝日のデータを返す。
     */
    const all = (): HolidayJP[] => {
        return Object.values(store.holiday).flat();
    };

    /**
     * 最も過去の祝日のデータを返す。
     */
    const min = (): HolidayJP => {
        const years = Object.keys(store.holiday).map((value) => Number(value));
        return store.holiday[Math.min(...years)][0];
    };

    /**
     * 最も未来の祝日のデータを返す。
     */
    const max = (): HolidayJP => {
        const years = Object.keys(store.holiday).map((value) => Number(value));
        const holiday = store.holiday[Math.max(...years)];
        return holiday[holiday.length - 1];
    };

    /**
     * ストア設定を返す。
     */
    const setting = (): HolidayJPSetting => {
        return structuredClone(store.setting);
    };

    /**
     * 引数で指定したdateオブジェクトからJPHolidayConditionオブジェクトを生成して返す。
     */
    const createCond = (date: Date): HolidayJPCondition => {
        const jstDate = store.setting.timezoneEffect ? _createJSTDate(date) : date;
        return {
            year: jstDate.getFullYear(),
            month: jstDate.getMonth() + 1,
            date: jstDate.getDate(),
        };
    };
    // JSTでの日付を示すDateオブジェクトを作る。ややこしいので内部関数。
    const _createJSTDate = (date: Date): Date => {
        const jstDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000);
        return new Date(jstDate.getFullYear(), jstDate.getMonth(), jstDate.getDate());
    };

    /**
     * 引数で指定したHolidayJPConditionオブジェクトからタイムゾーンを考慮したDateオブジェクトを生成して返す。
     */
    const createDate = (cond: HolidayJPCondition) => {
        if (!isValidDate(cond)) {
            throw new Error('[@sway11466/holyday-jp error] invalid date.');
        }
        const year = String(cond.year as number);
        const month = String(cond.month as number).padStart(2, '0');
        const date = String(cond.date as number).padStart(2, '0');
        const isoString = `${year}-${month}-${date}T00:00:00+09:00`;
        return new Date(isoString);
    };

    /**
     * 指定した日付が存在する日付の場合にtrueを返す。
     */
    const isValidDate = (cond: Date | HolidayJPCondition) => {
        return isValidDateImpl(cond instanceof Date ? createCond(cond) : cond);
    };
    const isValidDateImpl = (cond: HolidayJPCondition) => {
        if (cond.year === undefined || cond.month === undefined || cond.date === undefined) {
            return false;
        }
        const year = String(cond.year);
        const month = String(cond.month as number).padStart(2, '0');
        const date = String(cond.date as number).padStart(2, '0');
        return !isNaN(new Date(`${year}-${month}-${date}`).getDate());
    };

    /**
     * 指定した日付がサポート対象の年の場合にtrueを返す。
     */
    const isSupportDate = (cond: Date | HolidayJPCondition) => {
        return isSupportDateImpl(cond instanceof Date ? createCond(cond) : cond);
    };
    const isSupportDateImpl = (cond: HolidayJPCondition) => {
        if (!cond.year) {
            return true;
        }
        return min().year <= cond.year && cond.year <= max().year;
    };

    /**
     * 条件に合致する祝日のデータを返す。
     * 条件に合致する祝日がない場合には空の配列を返す。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     */
    const get = (cond?: Date | HolidayJPCondition): HolidayJP[] => {
        return getImpl(cond instanceof Date ? createCond(cond) : cond);
    };
    const getImpl = (cond?: HolidayJPCondition): HolidayJP[] => {
        if (cond === null || cond === undefined) {
            return all();
        }
        if (!isSupportDate(cond)) {
            if (store.setting.unsupportedDateBehavior === 'ignore') {
                return [];
            }
            throw new Error('[@sway11466/holyday-jp error] not supported date.');
        }
        const holiday = cond.year ? store.holiday[cond.year] : all();
        return holiday.filter((value) => {
            return (cond.month === undefined || value.month === cond.month) && (cond.date === undefined || value.date === cond.date) && (cond.name === undefined || value.name === cond.name);
        });
    };

    /**
     * 指定した日付が祝日の場合にtrueを返す。
     */
    const isHoliday = (date: Date | HolidayJPCondition) => {
        return isHolidayImpl(date instanceof Date ? createCond(date) : date);
    };
    const isHolidayImpl = (date: HolidayJPCondition) => {
        if (!isValidDateImpl(date)) {
            throw new Error(`[@sway11466/holyday-jp error] invalid date. date=${date}`);
        }
        if (!isSupportDateImpl(date)) {
            if (store.setting.unsupportedDateBehavior === 'ignore') {
                return false;
            }
            throw new Error(`@sway11466/holyday-jp error] not supported date. date=${date}`);
        }
        return get(date).length > 0;
    };

    /**
     * 指定した日付が週末の場合にtrueを返す。
     */
    const isWeekend = (date: Date | HolidayJPCondition) => {
        return isWeekendImpl(date instanceof Date ? createCond(date) : date);
    };
    const isWeekendImpl = (date: HolidayJPCondition) => {
        if (!isValidDateImpl(date)) {
            throw new Error(`[@sway11466/holyday-jp error] invalid date. date=${date}`);
        }
        if (!isSupportDateImpl(date) && store.setting.unsupportedDateBehavior !== 'ignore') {
            throw new Error(`@sway11466/holyday-jp error] not supported date. date=${date}`);
        }
        const jstDate = new Date(date.year as number, (date.month as number) - 1, date.date);
        return store.setting.weekend.some((day) => day === jstDate.getDay());
    };

    /**
     * 指定した日付が平日の場合にtrueを返す。平日とは週末（土日）でも祝日でもない日付のこと。
     */
    const isWeekday = (date: Date | HolidayJPCondition) => {
        return isWeekdayImpl(date instanceof Date ? createCond(date) : date);
    };
    const isWeekdayImpl = (date: HolidayJPCondition) => {
        return !isWeekendImpl(date) && !isHolidayImpl(date);
    };

    return { all, min, max, setting, createCond, createDate: createDate, isValidDate, isSupportDate, get, isHoliday, isWeekend, isWeekday };
};

export { useHolidayJP };
export { HolidayJP, HolidayJPCondition, HolidayJPStore };

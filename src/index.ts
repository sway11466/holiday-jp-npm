import fs from 'fs';
import path from 'path';
import { HolidayJP } from './HolidayJP';
import { HolidayJPCondition } from './HolidayJPCondition';
import { HolidayJPStore } from './HolidayJPStore';
import { HolidayJPSetting } from './HolidayJPSetting';

/**
 * デフォルト設定を生成する。
 */
const createDefaultStoreSetting = (): HolidayJPSetting => {
    return {
        timezoneEffect: true
    };
}

/**
 * 引数で指定したyear/month/dayをJST日付とみなして、タイムゾーンを考慮したDateオブジェクトを生成する。時刻は00:00:00となる。
 */
const initLocalDate = (year: number, month: number, day: number) => {
    const fillYear = year.toString();
    const fillMonth = month.toString().padStart(2, '0');
    const fillDay = day.toString().padStart(2, '0');
    const isoString = `${fillYear}-${fillMonth}-${fillDay}T00:00:00+09:00`;
    return new Date(isoString);
}

/**
 * 内閣府公開の休日のデータを読み込む。
 * 
 * @see https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
 * @see https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv
 */
const store: HolidayJPStore = (() => {
    const store: HolidayJPStore = { holiday: {}, setting: createDefaultStoreSetting() };
    const csvPath = path.join(path.dirname(__filename), 'syukujitsu.csv');
    fs.readFileSync(csvPath).toString().split('\r\n').forEach((value) => {
        if (!value.match(/\d+\/\d+\/\d+/)) { return; } // ヘッダーと空行を除く
        const [date, name] = value.split(',');
        const [year, month, day] = date.split('/').map(value => Number(value));
        if (store.holiday[year] === undefined) {
            store.holiday[year] = [];
        }
        store.holiday[year].push({
            year,
            month,
            day,
            name,
            localDate: initLocalDate(year, month, day)
        }); 
    });
    return store;
})();

/**
 * 祝日を扱う機能を返す。
 * 
 * @returns 
 */
const useHolidayJP = (initSetting?: HolidayJPSetting) => {

    /**
     * 設定を反映する。
     */
    ((setting) => {
        if (setting === undefined) { return; }
        Object.assign(store.setting, setting);
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
        const years = Object.keys(store.holiday).map(value => Number(value));
        return store.holiday[Math.min(...years)][0];
    };

    /**
     * 最も未来の祝日のデータを返す。
     */
    const max = (): HolidayJP => {
        const years = Object.keys(store.holiday).map(value => Number(value));
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
            day: jstDate.getDate()
        };
    }
    // JSTでの日付を示すDateオブジェクトを作る。ややこしいので内部関数。
    const _createJSTDate = (date: Date): Date => {
        const jstDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (9 * 60 * 60 * 1000));
        return new Date(jstDate.getFullYear(), jstDate.getMonth(), jstDate.getDate());
    }

    /**
     * 引数で指定したHolidayJPConditionオブジェクトからタイムゾーンを考慮したDateオブジェクトを生成して返す。
     */
    const createDate = (cond: HolidayJPCondition) => {
        if (!isValidDate(cond)) {
            throw new Error('[@sway11466/holyday-jp error] invalid date.');
        }
        const year = (cond.year as number).toString();
        const month = (cond.month as number).toString().padStart(2, '0');
        const day = (cond.day as number).toString().padStart(2, '0');
        const isoString = `${year}-${month}-${day}T00:00:00+09:00`;
        return new Date(isoString);
    }

    /**
     * 指定した日付が存在する日付の場合にtrueを返す。
     */
    const isValidDate = (cond: Date | HolidayJPCondition) => {
        return isValidDateImpl((cond instanceof Date) ? createCond(cond) : cond);
    };
    const isValidDateImpl = (cond: HolidayJPCondition) => {
        if (cond.year === undefined || cond.month === undefined || cond.day === undefined) {
            return false;
        }
        const year = cond.year.toString();
        const month = cond.month?.toString().padStart(2, '0');
        const day = cond.day?.toString().padStart(2, '0');
        return !isNaN(new Date(`${year}-${month}-${day}`).getDate());
    };

    /**
     * 指定した日付がサポート対象の年の場合にtrueを返す。
     */
    const isSupportDate = (cond: Date | HolidayJPCondition) => {
        return isSupportDateImpl((cond instanceof Date) ? createCond(cond) : cond);
    };
    const isSupportDateImpl = (cond: HolidayJPCondition) => {
        if (!cond.year) { return true; }
        return min().year <= cond.year && cond.year <= max().year;
    };

    /**
     * 条件に合致する祝日のデータを返す。
     * 条件に合致する祝日がない場合には空の配列を返す。
     * サポート外の年の条件を指定した場合にはエラーをthrowする。
     * @todo date型も受け取れるようにする
     */
    const get = (cond?: HolidayJPCondition): HolidayJP[] => {
        if (cond === null || cond === undefined) {
            return all();
        }
        if (!isSupportDate(cond)) {
            throw new Error('[@sway11466/holyday-jp error] not supported date.');
        }
        const holiday = (cond.year) ? store.holiday[cond.year] : all();
        return holiday.filter((value) => {
            return (cond.month === undefined || value.month === cond.month) &&
                (cond.day === undefined || value.day === cond.day) &&
                (cond.name === undefined || value.name === cond.name);
        });
    };

    /**
     * 指定した日付が祝日の場合にtrueを返す。
     */
    const isHoliday = (date: Date | HolidayJPCondition) => {
        return isHolidayImpl((date instanceof Date) ? createCond(date) : date);
    };
    const isHolidayImpl = (date: HolidayJPCondition) => {
        if (!isValidDateImpl(date)) {
            throw new Error(`[@sway11466/holyday-jp error] invalid date. date=${date}`);
        }
        if (!isSupportDateImpl(date)) {
            throw new Error(`@sway11466/holyday-jp error] not supported date. date=${date}`);
        }
        return get(date).length > 0;
    };

    /**
     * 指定した日付が土日の場合にtrueを返す。
     */
    const isWeekend = (date: Date | HolidayJPCondition) => {
        return isWeekendImpl((date instanceof Date) ? createCond(date) : date);
    }
    const isWeekendImpl = (date: HolidayJPCondition) => {
        if (!isValidDateImpl(date)) {
            throw new Error(`[@sway11466/holyday-jp error] invalid date. date=${date}`);
        }
        if (!isSupportDateImpl(date)) {
            throw new Error(`@sway11466/holyday-jp error] not supported date. date=${date}`);
        }
        const jstDate = new Date(date.year as number, date.month as number- 1, date.day);
        return jstDate.getDay() === 0 || jstDate.getDay() === 6;
    }

    /**
     * 指定した日付が平日の場合にtrueを返す。平日とは週末（土日）でも祝日でもない日付のこと。
     */
    const isWeekday = (date: Date | HolidayJPCondition) => {
        return isWeekdayImpl((date instanceof Date) ? createCond(date) : date);
    }
    const isWeekdayImpl = (date: HolidayJPCondition) => {
        return !isWeekendImpl(date) && !isHolidayImpl(date);
    }

    return { all, min, max, setting, createCond, createDate: createDate, isValidDate, isSupportDate, get, isHoliday, isWeekend, isWeekday };
}

export { useHolidayJP };
export { HolidayJP, HolidayJPCondition, HolidayJPStore };

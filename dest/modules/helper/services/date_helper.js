"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateHelper {
    static addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }
    static addMinutes(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
    static addHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    }
    static addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    static addMonths(date, months) {
        date.setMonth(date.getMonth() + months);
        return date;
    }
    static addYears(date, years) {
        date.setFullYear(date.getFullYear() + years);
        return date;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=date_helper.js.map
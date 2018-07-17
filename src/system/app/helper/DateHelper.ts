export class DateHelper {
    static addSeconds(date: Date, seconds: number): Date {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    static addMinutes(date: Date, minutes: number): Date {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }

    static addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }

    static addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }

    static addMonths(date: Date, months: number): Date {
        date.setMonth(date.getMonth() + months);
        return date;
    }

    static addYears(date: Date, years: number): Date {
        date.setFullYear(date.getFullYear() + years);
        return date;
    }
}

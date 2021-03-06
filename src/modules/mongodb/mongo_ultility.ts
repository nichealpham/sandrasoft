// Import external-modules
import { Types } from 'mongoose';
// Import peer-modules
// Import sub-modules

export class MongoUltility {
    static isObjectId(id): boolean {
        return id && id._bsontype === 'ObjectID';
    }

    static toObjectId(id) {
        return typeof id === 'string' ? Types.ObjectId.createFromHexString(id) : id;
    }

    static handleDataModel<T>(data, dataType: {new(d): T}): string | T {
        if (!data) {
            return '';
        }
        if (this.isObjectId(data)) {
            return data.toString();
        }
        if (dataType) {
            return new dataType(data);
        }
        return '';
    }

    static handleFileModel(file): string {
        if (file) {
            if (this.isObjectId(file)) {
                return file.toString();
            }
            if (file.url) {
                return file.url;
            }
        }
        return file;
    }

    static filterDataInput<T>(entity: T, data, fields: string[]): T {
        for (let i = 0; i < fields.length; i++) {
            if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined) {
                entity[fields[i]] = data[fields[i]];
            }
        }
        return entity;
    }

    static applyTemplate(template: string, ...params): string {
        return template.replace(/{(\d+)}/g, (match, templateIndex) => {
            return params[templateIndex] || match;
        });
    }

    static convertToCurrency(value: number, option): string {
        if (typeof value !== 'number') {
            return '';
        }

        if (!option) {
            option = {};
        }
        if (!option.format) {
            option.format = 'en-US';
        }
        if (!option.currency) {
            option.currency = 'USD';
        }

        return value.toLocaleString(option.format, {style: 'currency', currency: option.currency});
    }

    static convertStringToBoolean(val: string): boolean {
        if (!val) {
            return false;
        }
        val = val.toString();

        switch (val.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true;
        case 'false': case 'no': case '0': return false;
        default: return false;
        }
    }
}
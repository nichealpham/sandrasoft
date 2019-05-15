"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class MongoUltility {
    static isObjectId(id) {
        return id && id._bsontype === 'ObjectID';
    }
    static toObjectId(id) {
        return typeof id === 'string' ? mongoose_1.Types.ObjectId.createFromHexString(id) : id;
    }
    static handleDataModel(data, dataType) {
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
    static handleFileModel(file) {
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
    static filterDataInput(entity, data, fields) {
        for (let i = 0; i < fields.length; i++) {
            if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined) {
                entity[fields[i]] = data[fields[i]];
            }
        }
        return entity;
    }
    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, templateIndex) => {
            return params[templateIndex] || match;
        });
    }
    static convertToCurrency(value, option) {
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
        return value.toLocaleString(option.format, { style: 'currency', currency: option.currency });
    }
    static convertStringToBoolean(val) {
        if (!val) {
            return false;
        }
        val = val.toString();
        switch (val.toLowerCase().trim()) {
            case 'true':
            case 'yes':
            case '1': return true;
            case 'false':
            case 'no':
            case '0': return false;
            default: return false;
        }
    }
}
exports.MongoUltility = MongoUltility;
//# sourceMappingURL=mongo_ultility.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const logger_1 = require("./logger");
const mongoose_1 = require("mongoose");
const connections = {};
const collections = {};
class MongoDb {
    static connect(config) {
        let collection = this.findCollection(config);
        if (!collection) {
            let connection = this.findConnection(config);
            if (!connection) {
                connection = this.initConnection(config);
            }
            collection = this.initCollection(connection, config);
        }
        return collection;
    }
    static findCollection(config) {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        return collections[secreteKey];
    }
    static findConnection(config) {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        return connections[secreteKey];
    }
    static initCollection(connection, config) {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        let collection = new MongoCollection(connection, config.modelname, config.schema);
        collections[secreteKey] = collection;
        return collection;
    }
    static initConnection(config) {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        let connection = Mongoose.createConnection(secreteKey, {
            useNewUrlParser: true,
            useCreateIndex: true,
        });
        connection.on('error', (error) => {
            logger_1.Logger.error(`Mongoose Connection Error!`);
            logger_1.Logger.error(`Message: ${error.toString()} !`);
        });
        connection.once('open', () => {
            collections[secreteKey] = connection;
            logger_1.Logger.info(`Mongoose Connection Success, db: ${config.dbname}`);
        });
        return connection;
    }
}
exports.MongoDb = MongoDb;
class MongoCollection {
    constructor(connector, modelname, schema) {
        this.collection = null;
        this.collection = connector.model(modelname, schema);
    }
    validateParam(param) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};
        return param;
    }
    async find(param) {
        param = this.validateParam(param);
        let query = this.collection.find(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        if (param.order)
            query = query.sort(param.order);
        let pagination = new Pagination(param.page, param.limit);
        query = query.skip(pagination.skip()).limit(pagination.limit);
        let docs = await query.exec();
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async findAll(param) {
        param = this.validateParam(param);
        let query = this.collection.find(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        if (param.order)
            query = query.sort(param.order);
        let docs = await query.exec();
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async findOne(param) {
        param = this.validateParam(param);
        let query = this.collection.findOne(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        let doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }
    count(param) {
        return new Promise((resolve, reject) => {
            param = this.validateParam(param);
            this.collection.countDocuments(param.query, (err, count) => {
                if (err)
                    return reject(err);
                resolve(count);
            });
        });
    }
    async get(id, populate) {
        let query = this.collection.findById(id);
        if (populate)
            query = query.populate(populate);
        let doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }
    aggregate(query) {
        let doc = this.collection.aggregate(query).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async create(data) {
        let doc = await this.collection.create(data);
        return JSON.parse(JSON.stringify(doc));
    }
    async createMultiple(data) {
        let docs = await this.collection.create(data);
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async createOrUpdate(query, data) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let doc = await this.collection.findOneAndUpdate(query, data, options).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async update(id, data) {
        let result = await this.collection.updateOne({ _id: MongoUltility.toObjectId(id) }, data).exec();
        return result && result.ok > 0;
    }
    async findOneAndUpdate(query, data) {
        let doc = await this.collection.findOneAndUpdate(query, data, { new: true }).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async updateDataByFields(id, data, parentField) {
        if (id && data) {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    let prop = parentField ? parentField + '.' + field : field;
                    let dataUpdate = {};
                    dataUpdate[prop] = data[field];
                    await this.update(id, dataUpdate);
                }
            }
        }
    }
    async delete(id) {
        await this.collection.deleteOne({ _id: MongoUltility.toObjectId(id) }).exec();
        return true;
    }
}
exports.MongoCollection = MongoCollection;
class Pagination {
    constructor(page, limit) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;
        this.page = page;
        this.limit = limit;
        this.total = 0;
    }
    skip() {
        return (this.page - 1) * this.limit;
    }
}
class MongoUltility {
    static isObjectId(id) {
        return id && id._bsontype === 'ObjectID';
    }
    static toObjectId(id) {
        return typeof id === 'string' ? mongoose_1.Types.ObjectId.createFromHexString(id) : id;
    }
    static handleDataModel(data, Type) {
        if (!data)
            return '';
        if (this.isObjectId(data))
            return data.toString();
        if (Type)
            return new Type(data);
        return '';
    }
    static handleFileModel(file) {
        if (file) {
            if (this.isObjectId(file))
                return file.toString();
            if (file.url)
                return file.url;
        }
        return file;
    }
    static filterDataInput(entity, data, fields) {
        for (let i = 0; i < fields.length; i++) {
            if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined)
                entity[fields[i]] = data[fields[i]];
        }
        return entity;
    }
    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }
    static convertToCurrency(value, option) {
        if (typeof value !== 'number')
            return '';
        if (!option)
            option = {};
        if (!option.format)
            option.format = 'en-US';
        if (!option.currency)
            option.currency = 'USD';
        return value.toLocaleString(option.format, { style: 'currency', currency: option.currency });
    }
    static convertStringToBoolean(val) {
        if (!val)
            return false;
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
//# sourceMappingURL=mongodb.js.map
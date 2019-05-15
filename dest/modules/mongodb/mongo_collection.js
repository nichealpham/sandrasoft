"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_pagination_1 = require("./mongo_pagination");
const mongo_ultility_1 = require("./mongo_ultility");
class MongoCollection {
    constructor(connector, modelname, schema) {
        this.collection = connector.model(modelname, schema);
    }
    validateParam(param) {
        if (!param) {
            param = {};
        }
        if (!param.query) {
            param.query = {};
        }
        return param;
    }
    async find(param) {
        param = this.validateParam(param);
        let query = this.collection.find(param.query);
        if (param.select) {
            query = query.select(param.select);
        }
        if (param.populate) {
            query = query.populate(param.populate);
        }
        if (param.order) {
            query = query.sort(param.order);
        }
        const pagination = new mongo_pagination_1.Pagination(param.page, param.limit);
        query = query.skip(pagination.skip()).limit(pagination.limit);
        const docs = await query.exec();
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async findAll(param) {
        param = this.validateParam(param);
        let query = this.collection.find(param.query);
        if (param.select) {
            query = query.select(param.select);
        }
        if (param.populate) {
            query = query.populate(param.populate);
        }
        if (param.order) {
            query = query.sort(param.order);
        }
        const docs = await query.exec();
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async findOne(param) {
        param = this.validateParam(param);
        let query = this.collection.findOne(param.query);
        if (param.select) {
            query = query.select(param.select);
        }
        if (param.populate) {
            query = query.populate(param.populate);
        }
        const doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }
    count(param) {
        return new Promise((resolve, reject) => {
            param = this.validateParam(param);
            (this.collection).countDocuments(param.query, (err, count) => {
                if (err)
                    return reject(err);
                resolve(count);
            });
        });
    }
    async get(id, populate) {
        let query = this.collection.findById(id);
        if (populate) {
            query = query.populate(populate);
        }
        const doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }
    aggregate(query) {
        const doc = this.collection.aggregate(query).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async create(data) {
        const doc = await this.collection.create(data);
        return JSON.parse(JSON.stringify(doc));
    }
    async createMultiple(data) {
        const docs = await this.collection.create(data);
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }
    async createOrUpdate(query, data) {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const doc = await this.collection.findOneAndUpdate(query, data, options).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async update(id, data) {
        const result = await this.collection.updateOne({ _id: mongo_ultility_1.MongoUltility.toObjectId(id) }, data).exec();
        return result && result.ok > 0;
    }
    async findOneAndUpdate(query, data) {
        const doc = await this.collection.findOneAndUpdate(query, data, { new: true }).exec();
        return JSON.parse(JSON.stringify(doc));
    }
    async updateDataByFields(id, data, parentField) {
        if (id && data) {
            for (const field in data) {
                if (data.hasOwnProperty(field)) {
                    const prop = parentField ? parentField + '.' + field : field;
                    const dataUpdate = {};
                    dataUpdate[prop] = data[field];
                    await this.update(id, dataUpdate);
                }
            }
        }
    }
    async delete(id) {
        await this.collection.deleteOne({ _id: mongo_ultility_1.MongoUltility.toObjectId(id) }).exec();
        return true;
    }
}
exports.MongoCollection = MongoCollection;
//# sourceMappingURL=mongo_collection.js.map
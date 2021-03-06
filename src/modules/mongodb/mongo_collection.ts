// Import external-modules
import * as Mongoose from 'mongoose';

// Import peer-modules
// Import sub-modules
import { Pagination } from './mongo_pagination';
import { MongoUltility } from './mongo_ultility';

export class MongoCollection {
    protected collection;

    constructor(connector: Mongoose.Connection, modelname: string, schema: Mongoose.Schema) {
        this.collection = connector.model(modelname, schema);
    }

    protected validateParam(param?) {
        if (!param) {
            param = {};
        }
        if (!param.query) {
            param.query = {};
        }

        return param;
    }

    async find(param?) {
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

        const pagination = new Pagination(param.page, param.limit);
        query = query.skip(pagination.skip()).limit(pagination.limit);

        const docs = await query.exec();
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }

    async findAll(param?) {
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

    async findOne(param?) {
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

    count(param?): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            param = this.validateParam(param);
            (this.collection).countDocuments(param.query, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
    }

    async get(id: string, populate?) {
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

    async update(id: string, data): Promise<boolean> {
        const result = await this.collection.updateOne({ _id: MongoUltility.toObjectId(id) }, data).exec();
        return result && result.ok > 0;
    }

    async findOneAndUpdate(query, data) {
        const doc = await this.collection.findOneAndUpdate(query, data, { new: true }).exec();
        return JSON.parse(JSON.stringify(doc));
    }

    async updateDataByFields(id: string, data, parentField?: string): Promise<void> {
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

    async delete(id: string): Promise<boolean> {
        await this.collection.deleteOne({ _id: MongoUltility.toObjectId(id) }).exec();
        return true;
    }
}
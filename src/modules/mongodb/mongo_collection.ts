// Import external-modules
import * as Mongoose from 'mongoose';

// Import peer-modules
// Import sub-modules
import { Pagination } from './mongo_pagination';
import { MongoUltility } from './mongo_ultility';

export class MongoCollection {
    protected collection: any = null;

    constructor(connector: Mongoose.Connection, modelname: string, schema: Mongoose.Schema) {
        this.collection = connector.model(modelname, schema);
    }

    protected validateParam(param?: any) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};

        return param;
    }

    async find(param?: any) {
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

    async findAll(param?: any) {
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

    async findOne(param?: any) {
        param = this.validateParam(param);
        let query = this.collection.findOne(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        let doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }

    count(param?: any): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            param = this.validateParam(param);
            (this.collection as any).countDocuments(param.query, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
    }

    async get(id: any, populate?: any) {
        let query = this.collection.findById(id);

        if (populate)
            query = query.populate(populate);

        let doc = await query.exec();
        return JSON.parse(JSON.stringify(doc));
    }

    aggregate(query: any) {
        let doc = this.collection.aggregate(query).exec();
        return JSON.parse(JSON.stringify(doc));
    }

    async create(data: any) {
        let doc = await this.collection.create(data);
        return JSON.parse(JSON.stringify(doc));
    }

    async createMultiple(data: any[]) {
        let docs = await this.collection.create(data);
        return docs.map(doc => JSON.parse(JSON.stringify(doc)));
    }

    async createOrUpdate(query: any, data: any) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let doc = await this.collection.findOneAndUpdate(query, data, options).exec();
        return JSON.parse(JSON.stringify(doc));
    }

    async update(id: any, data: any): Promise<boolean> {
        let result = await this.collection.updateOne({ _id: MongoUltility.toObjectId(id) }, data).exec();
        return result && result.ok > 0;
    }

    async findOneAndUpdate(query: any, data: any) {
        let doc = await this.collection.findOneAndUpdate(query, data, { new: true }).exec();
        return JSON.parse(JSON.stringify(doc));
    }

    async updateDataByFields(id: any, data: any, parentField?: string): Promise<void> {
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

    async delete(id: any): Promise<boolean> {
        await this.collection.deleteOne({ _id: MongoUltility.toObjectId(id) }).exec();
        return true;
    }
}
import { MongooseFunction } from './MongooseFunction';
import * as mongoose from 'mongoose';

export class MongooseRepository {
    protected model: mongoose.Model<mongoose.Document>;

    constructor(collectionName: string) {
        this.model = new mongoose.Model(collectionName);
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
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        if (param.order)
            query = query.sort(param.order);

        let pagination = new Pagination(param.page, param.limit);
        query = query.skip(pagination.skip()).limit(pagination.limit);

        return await query.exec();
    }

    async findAll(param?: any) {
        param = this.validateParam(param);
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        if (param.order)
            query = query.sort(param.order);

        return await query.exec();
    }

    async findOne(param?: any) {
        param = this.validateParam(param);
        let query = this.model.findOne(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        return await query.exec();
    }

    count(param?: any): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            param = this.validateParam(param);
            (this.model as any).countDocuments(param.query, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
    }

    async get(id: string | mongoose.Schema.Types.ObjectId, populate?: any) {
        let query = this.model.findById(id);

        if (populate)
            query = query.populate(populate);

        return await query.exec();
    }

    aggregate(query: any) {
        return this.model.aggregate(query).exec();
    }

    async create(data: any) {
        return await this.model.create(data);
    }

    async createMultiple(data: any[]) {
        return await this.model.create(data);
    }

    async createOrUpdate(query: any, data: any) {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return await this.model.findOneAndUpdate(query, data, options).exec();
    }

    async update(id: string | mongoose.Schema.Types.ObjectId, data: any): Promise<boolean> {
        let result = await this.model.update({_id: MongooseFunction.toObjectId(id)}, data).exec();
        return result && result.ok > 0;
    }

    async findOneAndUpdate(query: any, data: any) {
        return await this.model.findOneAndUpdate(query, data, {new: true}).exec();
    }

    async updateDataByFields(id: string | mongoose.Schema.Types.ObjectId, data: any, parentField?: string): Promise<void> {
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

    async delete(id: string | mongoose.Schema.Types.ObjectId, isRealDelete: boolean = false): Promise<boolean> {
        if (!isRealDelete) {
            let result = await this.model.update({_id: MongooseFunction.toObjectId(id)}, {deletedAt: new Date()}).exec();
            return result && result.ok > 0;
        }
        await this.model.remove({_id: MongooseFunction.toObjectId(id)}).exec();
        return true;
    }
}

class Pagination {
    page: number;
    limit: number;
    total: number;

    constructor(page?: number, limit?: number) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;

        this.page = page;
        this.limit = limit;
        this.total = 0;
    }

    skip(): number {
        return (this.page - 1) * this.limit;
    }
}
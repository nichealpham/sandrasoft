import * as Mongoose from 'mongoose';
import { Logger } from './logger';
import { Types } from 'mongoose';

const connections: any = {};     // {'connectionString': Mongoose.Connection}
const collections: any = {};     // {'collectionString': MongoCollection}

export class MongoDb {
    public static connect(config: IDbConfig): MongoCollection {
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

    private static findCollection(config: IDbConfig): MongoCollection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        return collections[secreteKey];
    }

    private static findConnection(config: IDbConfig): Mongoose.Connection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        return connections[secreteKey];
    }

    private static initCollection(connection: Mongoose.Connection, config: IDbConfig): MongoCollection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        let collection = new MongoCollection(connection, config.modelname, config.schema);
        collections[secreteKey] = collection;
        return collection;
    }

    private static initConnection(config: IDbConfig): Mongoose.Connection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        let connection = Mongoose.createConnection(secreteKey, { 
            useNewUrlParser: true,
            useCreateIndex: true,
        });
        connection.on('error', (error) => {
            Logger.error(`Mongoose Connection Error!`);
            Logger.error(`Message: ${error.toString()} !`);
        });
        connection.once('open', () => {
            collections[secreteKey] = connection;
            Logger.info(`Mongoose Connection Success, db: ${config.dbname}`);
        });
        return connection;
    }
}

export interface IDbConfig {
    username: string,
    password: string,
    hostname: string,
    dbname: string,
    modelname: string,
    schema: Mongoose.Schema,
}

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
        let result = await this.collection.updateOne({ _id: MongooseFunction.toObjectId(id) }, data).exec();
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
        await this.collection.deleteOne({ _id: MongooseFunction.toObjectId(id) }).exec();
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

export class MongooseFunction {
    static isObjectId(id: any): boolean {
        return id && id._bsontype === 'ObjectID';
    }

    static toObjectId(id: any) {
        return typeof id === 'string' ? Types.ObjectId.createFromHexString(id) : id;
    }

    static handleDataModel<T>(data: any, Type: {new(d: any): T}): string | T {
        if (!data)
            return '';
        if (this.isObjectId(data))
            return data.toString();
        if (Type)
            return new Type(data);
        return '';
    }

    static handleFileModel(file): string {
        if (file) {
            if (this.isObjectId(file))
                return file.toString();
            if (file.url)
                return file.url;
        }
        return file;
    }

    static filterDataInput<T>(entity: T, data: any, fields: string[]): T {
        for (let i = 0; i < fields.length; i++) {
            if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined)
                entity[fields[i]] = data[fields[i]];
        }
        return entity;
    }

    static applyTemplate(template: string, ...params): string {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }

    static convertToCurrency(value: number, option): string {
        if (typeof value !== 'number')
            return '';

        if (!option)
            option = {};
        if (!option.format)
            option.format = 'en-US';
        if (!option.currency)
            option.currency = 'USD';

        return value.toLocaleString(option.format, {style: 'currency', currency: option.currency});
    }

    static convertStringToBoolean(val: string): boolean {
        if (!val)
            return false;
        val = val.toString();

        switch (val.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true;
        case 'false': case 'no': case '0': return false;
        default: return false;
        }
    }
}
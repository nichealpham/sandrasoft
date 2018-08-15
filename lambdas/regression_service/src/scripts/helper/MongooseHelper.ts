// import { DataHelper } from './DataHelper';
// import { ServiceConfig } from '../../system/Config';
// import * as mongoose from 'mongoose';

// export class MongooseRepository {
//     protected model: mongoose.Model<mongoose.Document>;

//     constructor(schemaModel: mongoose.Model<mongoose.Document>) {
//         this.model = schemaModel;
//     }

//     protected validateParam(param?: any) {
//         if (!param)
//             param = {};
//         if (!param.query)
//             param.query = {};

//         return param;
//     }

//     async find(param?: any) {
//         param = this.validateParam(param);
//         let query = this.model.find(param.query);

//         if (param.select)
//             query = query.select(param.select);

//         if (param.populate)
//             query = query.populate(param.populate);

//         if (param.order)
//             query = query.sort(param.order);

//         let pagination = new Pagination(param.page, param.limit);
//         query = query.skip(pagination.skip()).limit(pagination.limit);

//         return await query.exec();
//     }

//     async findAll(param?: any) {
//         param = this.validateParam(param);
//         let query = this.model.find(param.query);

//         if (param.select)
//             query = query.select(param.select);

//         if (param.populate)
//             query = query.populate(param.populate);

//         if (param.order)
//             query = query.sort(param.order);

//         return await query.exec();
//     }

//     async findOne(param?: any) {
//         param = this.validateParam(param);
//         let query = this.model.findOne(param.query);

//         if (param.select)
//             query = query.select(param.select);

//         if (param.populate)
//             query = query.populate(param.populate);

//         return await query.exec();
//     }

//     count(param?: any): Promise<number> {
//         return new Promise<number>((resolve, reject) => {
//             param = this.validateParam(param);
//             (this.model as any).countDocuments(param.query, (err, count) => {
//                 if (err) return reject(err);
//                 resolve(count);
//             });
//         });
//     }

//     async get(id: string | mongoose.Schema.Types.ObjectId, populate?: any) {
//         let query = this.model.findById(id);

//         if (populate)
//             query = query.populate(populate);

//         return await query.exec();
//     }

//     aggregate(query: any) {
//         return this.model.aggregate(query).exec();
//     }

//     async create(data: any) {
//         return await this.model.create(data);
//     }

//     async createMultiple(data: any[]) {
//         return await this.model.create(data);
//     }

//     async createOrUpdate(query: any, data: any) {
//         let options = {upsert: true, new: true, setDefaultsOnInsert: true};
//         return await this.model.findOneAndUpdate(query, data, options).exec();
//     }

//     async update(id: string | mongoose.Schema.Types.ObjectId, data: any): Promise<boolean> {
//         let result = await this.model.update({_id: DataHelper.toObjectId(id)}, data).exec();
//         return result && result.ok > 0;
//     }

//     async findOneAndUpdate(query: any, data: any) {
//         return await this.model.findOneAndUpdate(query, data, {new: true}).exec();
//     }

//     async updateDataByFields(id: string | mongoose.Schema.Types.ObjectId, data: any, parentField?: string): Promise<void> {
//         if (id && data) {
//             for (let field in data) {
//                 if (data.hasOwnProperty(field)) {
//                     let prop = parentField ? parentField + '.' + field : field;
//                     let dataUpdate = {};
//                     dataUpdate[prop] = data[field];
//                     await this.update(id, dataUpdate);
//                 }
//             }
//         }
//     }

//     async delete(id: string | mongoose.Schema.Types.ObjectId, isRealDelete: boolean = false): Promise<boolean> {
//         if (!isRealDelete) {
//             let result = await this.model.update({_id: DataHelper.toObjectId(id)}, {deletedAt: new Date()}).exec();
//             return result && result.ok > 0;
//         }
//         await this.model.remove({_id: DataHelper.toObjectId(id)}).exec();
//         return true;
//     }
// }

// export class MongoAccess {
//     static get connection(): mongoose.Connection {
//         return mongoose.connection;
//     }

//     static createDBConnection(host: string, port: number, dbName: string, username?: string, password?: string): Promise<mongoose.Connection> {
//         (mongoose as any).Promise = Promise;
//         let uri = `mongodb://${host}:${port}/${dbName}`;

//         let options = {
//             user: username,
//             pass: password,
//             reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//             reconnectInterval: 500, // Reconnect every 500ms
//             useNewUrlParser: true
//         } as mongoose.ConnectionOptions;

//         return mongoose.connect(uri, options).then(mongo => mongo.connection);
//     }

//     static initSchema(schemaDefinition: mongoose.SchemaDefinition, isUseFlag: boolean = true): mongoose.Schema {
//         if (isUseFlag) {
//             schemaDefinition.createdAt = {
//                 type: Date,
//                 default: Date.now
//             };
//             schemaDefinition.updatedAt = {
//                 type: Date,
//                 default: Date.now
//             };
//             schemaDefinition.deletedAt = {
//                 type: Date
//             };
//         }
//         let schema = new mongoose.Schema(schemaDefinition);

//         if (isUseFlag) {
//             schema.pre('update', function() {
//                 this.update({}, { $set: { updatedAt: new Date() } });
//             });
//         }
//         return schema;
//     }
// }

// export class MongooseHelper {
//     static isObjectId(id: any): boolean {
//         return id && id._bsontype === 'ObjectID';
//     }

//     static toObjectId(id: any) {
//         return typeof id === 'string' ? mongoose.Types.ObjectId.createFromHexString(id) : id;
//     }

//     static handleDataModel<T>(data: any, Type: {new(d: any): T}): string | T {
//         if (!data)
//             return '';
//         if (MongooseHelper.isObjectId(data))
//             return data.toString();
//         if (Type)
//             return new Type(data);
//         return '';
//     }

//     static handleFileModel(file): string {
//         if (file) {
//             if (MongooseHelper.isObjectId(file))
//                 return file.toString();
//             if (file.url)
//                 return file.url;
//         }
//         return file;
//     }

//     static filterDataInput<T>(entity: T, data: any, fields: string[]): T {
//         for (let i = 0; i < fields.length; i++) {
//             if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined)
//                 entity[fields[i]] = data[fields[i]];
//         }
//         return entity;
//     }

//     static applyTemplate(template: string, ...params): string {
//         return template.replace(/{(\d+)}/g, (match, number) => {
//             return params[number] || match;
//         });
//     }

//     static convertToCurrency(value: number, option): string {
//         if (typeof value !== 'number')
//             return '';

//         if (!option)
//             option = {};
//         if (!option.format)
//             option.format = 'en-US';
//         if (!option.currency)
//             option.currency = 'USD';

//         return value.toLocaleString(option.format, {style: 'currency', currency: option.currency});
//     }

//     static convertStringToBoolean(val: string): boolean {
//         if (!val)
//             return false;
//         val = val.toString();

//         switch (val.toLowerCase().trim()) {
//         case 'true': case 'yes': case '1': return true;
//         case 'false': case 'no': case '0': return false;
//         default: return false;
//         }
//     }
// }
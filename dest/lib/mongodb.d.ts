import * as Mongoose from 'mongoose';
export declare class MongoDb {
    static connect(config: IMongoDbConfig): MongoCollection;
    private static findCollection;
    private static findConnection;
    private static initCollection;
    private static initConnection;
}
export interface IMongoDbConfig {
    username: string;
    password: string;
    hostname: string;
    dbname: string;
    modelname: string;
    schema: Mongoose.Schema;
}
export declare class MongoCollection {
    protected collection: any;
    constructor(connector: Mongoose.Connection, modelname: string, schema: Mongoose.Schema);
    protected validateParam(param?: any): any;
    find(param?: any): Promise<any>;
    findAll(param?: any): Promise<any>;
    findOne(param?: any): Promise<any>;
    count(param?: any): Promise<number>;
    get(id: any, populate?: any): Promise<any>;
    aggregate(query: any): any;
    create(data: any): Promise<any>;
    createMultiple(data: any[]): Promise<any>;
    createOrUpdate(query: any, data: any): Promise<any>;
    update(id: any, data: any): Promise<boolean>;
    findOneAndUpdate(query: any, data: any): Promise<any>;
    updateDataByFields(id: any, data: any, parentField?: string): Promise<void>;
    delete(id: any): Promise<boolean>;
}
export declare class MongoUltility {
    static isObjectId(id: any): boolean;
    static toObjectId(id: any): any;
    static handleDataModel<T>(data: any, Type: {
        new (d: any): T;
    }): string | T;
    static handleFileModel(file: any): string;
    static filterDataInput<T>(entity: T, data: any, fields: string[]): T;
    static applyTemplate(template: string, ...params: any[]): string;
    static convertToCurrency(value: number, option: any): string;
    static convertStringToBoolean(val: string): boolean;
}

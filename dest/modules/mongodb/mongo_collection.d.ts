import * as Mongoose from 'mongoose';
export declare class MongoCollection {
    protected collection: any;
    constructor(connector: Mongoose.Connection, modelname: string, schema: Mongoose.Schema);
    protected validateParam(param?: any): any;
    find(param?: any): Promise<any>;
    findAll(param?: any): Promise<any>;
    findOne(param?: any): Promise<any>;
    count(param?: any): Promise<number>;
    get(id: string, populate?: any): Promise<any>;
    aggregate(query: any): any;
    create(data: any): Promise<any>;
    createMultiple(data: any): Promise<any>;
    createOrUpdate(query: any, data: any): Promise<any>;
    update(id: string, data: any): Promise<boolean>;
    findOneAndUpdate(query: any, data: any): Promise<any>;
    updateDataByFields(id: string, data: any, parentField?: string): Promise<void>;
    delete(id: string): Promise<boolean>;
}

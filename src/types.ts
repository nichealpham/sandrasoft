export declare class Logger {
    static logger: any;
    static init(config: ILoggerConfig): void;
    static debug(message: string): void;
    static info(message: string): void;
    static warn(message: string): void;
    static error(message: string): void;
}
export interface ILoggerConfig {
    logFilePath: String;
    timestampFormat: String;
}
import * as Mongoose from 'mongoose';
export declare class MongoDb {
    static connect(config: IDbConfig): MongoCollection;
    private static findCollection;
    private static findConnection;
    private static initCollection;
    private static initConnection;
}
export interface IDbConfig {
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
export declare class MongooseFunction {
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
import * as express from 'express';
export declare class SandraCore {
    private _routeCounter;
    private server;
    private serverConfig;
    constructor(config: IServerConfig);
    private createServer;
    applyMiddleware(middleware: express.RequestHandler): void;
    applyRoutes(routes: IServerRoute[]): void;
    startListening(): Promise<boolean>;
    getServerConfig(): IServerConfig;
}
export interface IServerConfig {
    apiRoot: string;
    hostName: string;
    port: number;
    swagger: {
        url: string;
        enableUI: boolean;
        spec: any;
    };
    remoting: {
        cors: {
            origin: string | string[];
            optionsSuccessStatus: number;
        };
        json: {
            strict: boolean;
            limit: string;
        };
        urlencoded: {
            extended: boolean;
            limit: string;
        };
        logger: {
            logFilePath: string;
            timestampFormat: string;
        };
        rest: {
            errorHandler: {
                fieldName: string;
                writeLog: boolean;
            };
            successHandler: {
                fieldName: string;
                writeLog: boolean;
            };
            convertNullToError: boolean;
        };
    };
}
export interface IServerRoute {
    method: string;
    url: string;
    validators: Function[];
    controller: Function;
}
/// <reference types="node" />
export interface IStorageConfig {
    serviceAccountPath: string;
    directory: string;
}
export declare class GoogleStorage {
    private bucketName;
    private directory;
    private storage;
    constructor(config: IStorageConfig);
    getSubDirUri(): string;
    getGsuitUri(): string;
    exist(filePath: string): Promise<boolean>;
    uploadBuffer(filePath: string, buffer: Buffer, makePublic?: boolean, cacheControl?: string, prefix?: string, mimetype?: string): Promise<string>;
    uploadFile(filePath: string, makePublic?: boolean, cacheControl?: string, prefix?: string): Promise<string>;
    uploadFile2Folder(filePath: string, makePublic?: boolean, cacheControl?: string, prefix?: string): Promise<string>;
    getDownloadUrl(filePath: string, prefix?: string): Promise<string>;
    downloadFile(filePath: string, localPath: string): Promise<boolean>;
    deleteFile(filePath: string): Promise<boolean>;
    getMetaData(filePath: string): Promise<{
        name: any;
        bucket: any;
        storageClass: any;
        id: any;
        size: any;
        cacheControl: any;
        contentType: any;
        contentEncoding: any;
        mediaLink: any;
        metadata: any;
    }>;
    makePublic(filePath: string): Promise<boolean>;
    moveFile(filePath: string, fileDestPath: string): Promise<boolean>;
    moveUploadedFile(filename: string, fileDestPath: string): Promise<boolean>;
    copyFile(filePath: string, fileDestPath: string): Promise<boolean>;
    listFiles(prefix: string, delimiter?: string): Promise<{
        name: any;
    }[]>;
    protected createBucket(bucketName: string): Promise<boolean>;
    protected listBucketNames(): Promise<string[]>;
}
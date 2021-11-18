/// <reference types="node" />
/// <reference types="qs" />
import { Request } from 'express';
export interface UploaderMiddlewareStorageConfig {
    destination?: string;
    fileName?: (req: Request, file: UploaderFileObject, cb: Function) => void;
}
export interface UploaderFileObject {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}
export declare const allowSingleUploadMemory: (uploadKeyName?: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const allowMultipleUploadMemory: (uploadKeyName?: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const disableFileUpload: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const allowSingleStorageUpload: (uploadKeyName: string | undefined, storageConfig: UploaderMiddlewareStorageConfig) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const allowMultipleStorageUpload: (uploadKeyName: string | undefined, storageConfig: UploaderMiddlewareStorageConfig, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;

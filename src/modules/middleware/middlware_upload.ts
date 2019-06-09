// Import external-modules
import * as multer from 'multer';
import { Request } from 'express';

// Import peer-modules
import { SystemHelper } from '../helper';
// Import sub-modules

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
export const allowSingleUploadMemory = (uploadKeyName = 'file-upload') => {
    return multer({ storage: multer.memoryStorage() }).single(uploadKeyName);
};
export const allowMultipleUploadMemory = (uploadKeyName = 'file-upload', maxCount = 100) => {
    return multer({ storage: multer.memoryStorage() }).array(uploadKeyName, maxCount);
};
export const disableFileUpload = () => {
    return multer().none();
};
export const allowSingleStorageUpload = (uploadKeyName = 'file-upload', storageConfig: UploaderMiddlewareStorageConfig) => {
    const storageOptions: UploaderMiddlewareStorageConfig = {
        destination: storageConfig.destination || 'uploads/',
    };
    if (storageConfig.fileName) {
        storageOptions.fileName = storageConfig.fileName;
    }
    return multer({ storage: multer.diskStorage(storageOptions)}).single(uploadKeyName);
};
export const allowMultipleStorageUpload = (uploadKeyName = 'file-upload', storageConfig: UploaderMiddlewareStorageConfig, maxCount = 100) => {
    const storageOptions: UploaderMiddlewareStorageConfig = {
        destination: storageConfig.destination || 'uploads/',
    };
    if (storageConfig.fileName) {
        storageOptions.fileName = storageConfig.fileName;
    }
    return multer({ storage: multer.diskStorage(storageOptions)}).array(uploadKeyName, maxCount);
};
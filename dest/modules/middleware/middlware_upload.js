"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const helper_1 = require("../helper");
exports.allowSingleUploadMemory = (uploadKeyName = 'file-upload') => {
    return multer({ storage: multer.memoryStorage() }).single(uploadKeyName);
};
exports.allowMultipleUploadMemory = (uploadKeyName = 'file-upload', maxCount = 100) => {
    return multer({ storage: multer.memoryStorage() }).array(uploadKeyName, maxCount);
};
exports.disableFileUpload = () => {
    return multer().none();
};
exports.allowSingleStorageUpload = (uploadKeyName = 'file-upload', storageConfig) => {
    if (storageConfig.destination) {
        if (!helper_1.SystemHelper.dirExist(storageConfig.destination)) {
            helper_1.SystemHelper.createDir(storageConfig.destination);
        }
    }
    const storageOptions = {
        destination: storageConfig.destination || 'uploads/',
    };
    if (storageConfig.fileName) {
        storageOptions.fileName = storageConfig.fileName;
    }
    return multer({ storage: multer.diskStorage(storageOptions) }).single(uploadKeyName);
};
exports.allowMultipleStorageUpload = (uploadKeyName = 'file-upload', storageConfig, maxCount = 100) => {
    if (storageConfig.destination) {
        if (!helper_1.SystemHelper.dirExist(storageConfig.destination)) {
            helper_1.SystemHelper.createDir(storageConfig.destination);
        }
    }
    const storageOptions = {
        destination: storageConfig.destination || 'uploads/',
    };
    if (storageConfig.fileName) {
        storageOptions.fileName = storageConfig.fileName;
    }
    return multer({ storage: multer.diskStorage(storageOptions) }).array(uploadKeyName, maxCount);
};
//# sourceMappingURL=middlware_upload.js.map
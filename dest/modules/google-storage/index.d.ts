/// <reference types="node" />
import { GoogleStorageConfig } from './interfaces/google_storage_config';
declare class GoogleStorage {
    private bucketName;
    private directory;
    private storage;
    constructor(config: GoogleStorageConfig);
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
    listFiles(prefix: string, delimiter?: string): Promise<Array<{
        name: any;
    }>>;
    protected createBucket(bucketName: string): Promise<boolean>;
    protected listBucketNames(): Promise<string[]>;
}
export { GoogleStorageConfig, GoogleStorage, };

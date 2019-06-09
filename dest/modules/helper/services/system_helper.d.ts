/// <reference types="node" />
export declare class SystemHelper {
    static dirExist(path: string): boolean;
    static isDir(path: string): boolean;
    static createDir(path: string): Promise<boolean>;
    static removeDir(path: string): boolean;
    static writeBuffer(fullPath: string, data: Buffer): Promise<boolean>;
    static readBuffer(fullPath: string): Promise<Buffer>;
}

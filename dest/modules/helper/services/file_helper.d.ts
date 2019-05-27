/// <reference types="node" />
export declare class FileHelper {
    static convert2ReadableFileSize(size: number, decimal?: number): string;
    static readFileCsvFromUrl(url: string, separator?: string): Promise<Array<Array<string | number>>>;
    static readFileBufferFromUrl(url: string, bytesLength?: number, bytesOffset?: number): Promise<Buffer>;
}

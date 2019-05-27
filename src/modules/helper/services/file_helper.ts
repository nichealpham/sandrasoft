// Import external-modules
import * as https from 'https';
import * as http from 'http';
import * as zlib from 'zlib';
import * as csvParser from 'csv-parser';

// Import peer-modules
import { Logger } from '../../logger';

export class FileHelper {
    static convert2ReadableFileSize(size: number, decimal = 0): string {
        const i: number = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        const value = (size / Math.pow(1024, i)).toFixed(decimal);
        return value + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    static readFileCsvFromUrl(url: string, separator = ','): Promise<Array<Array<string | number>>> {
        const csvRows: Array<Array<string | number>> = [];
        return new Promise<Array<Array<string | number>>>((resolve) => {
            const requestHandler = (res: http.IncomingMessage) => {
                res.pipe(csvParser({separator})).on('data', (rowData) => {
                    csvRows.push(Object.values(rowData));        
                }).on('end', () => {
                    Logger.info(`Reading csv success! ${csvRows.length} rows`);
                    return resolve(csvRows);
                }).on('error', (err) => {
                    Logger.error(`Reading csv ${url} failed!`);
                    Logger.warn(`Error message: ${err.message.toString()}`);
                    return resolve(csvRows);
                });
            };
            Logger.info(`\n Reading csv file from ${url} ...`);
            if (url.includes('https')) https.get(url, res => requestHandler(res));
            else http.get(url, res => requestHandler(res));
        });
    }

    static readFileBufferFromUrl(url: string, bytesLength?: number, bytesOffset = 0): Promise<Buffer> {
        return new Promise<Buffer>((resolve) => {
            let request: http.ClientRequest;
            const requestHandler = (res: http.IncomingMessage) => {
                const chunks: Buffer[] = [];
                let chunkSize = 0;
                let nextStage: any = res;   // tslint:disable-line: no-any
                if (url.includes('.gz')) {
                    const unzip = zlib.createGunzip();
                    res.pipe(unzip);
                    nextStage = unzip;
                }
                nextStage.on('data', (buffer: Buffer) => {
                    chunks.push(buffer);
                    chunkSize += buffer.byteLength;
                    if (bytesLength && chunkSize > (bytesOffset + bytesLength)) {
                        request.abort();
                        buffer = Buffer.concat(chunks);
                        Logger.info(`Reading buffer success! ${buffer.byteLength}`);
                        return resolve(buffer.slice(bytesOffset, bytesOffset + bytesLength));
                    }
                }).on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    Logger.info(`Reading buffer success! ${buffer.byteLength}`);
                    return resolve(buffer.slice(bytesOffset));
                }).on('error', (err: Error) => {
                    const buffer = Buffer.concat(chunks);
                    Logger.error(`Reading buffer error!`);
                    Logger.warn(`Error message: ${err.message.toString()}`);
                    return resolve(buffer.slice(bytesOffset));
                });
            };
            Logger.info(`\n Reading buffer from ${url} ...`);
            if (url.includes('https')) {
                request = https.get(url, res => requestHandler(res));
            } else {
                request = http.get(url, res => requestHandler(res));
            }
        });
    }
}
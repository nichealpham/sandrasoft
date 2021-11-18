"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const https = require("https");
const http = require("http");
const zlib = require("zlib");
const csvParser = require("csv-parser");
const logger_1 = require("../../logger");
class FileHelper {
    static convert2ReadableFileSize(size, decimal = 0) {
        const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        const value = (size / Math.pow(1024, i)).toFixed(decimal);
        return value + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
    static readFileCsvFromUrl(url, separator = ',') {
        const csvRows = [];
        return new Promise((resolve) => {
            const requestHandler = (res) => {
                res.pipe(csvParser({ separator })).on('data', (rowData) => {
                    csvRows.push(Object.values(rowData));
                }).on('end', () => {
                    logger_1.Logger.info(`Reading csv success! ${csvRows.length} rows`);
                    return resolve(csvRows);
                }).on('error', (err) => {
                    logger_1.Logger.error(`Reading csv ${url} failed!`);
                    logger_1.Logger.warn(`Error message: ${err.message.toString()}`);
                    return resolve(csvRows);
                });
            };
            logger_1.Logger.info(`\n Reading csv file from ${url} ...`);
            if (url.includes('https'))
                https.get(url, res => requestHandler(res));
            else
                http.get(url, res => requestHandler(res));
        });
    }
    static readFileBufferFromUrl(url, bytesLength, bytesOffset = 0) {
        return new Promise((resolve) => {
            let request;
            const requestHandler = (res) => {
                const chunks = [];
                let chunkSize = 0;
                let nextStage = res;
                if (url.includes('.gz')) {
                    const unzip = zlib.createGunzip();
                    res.pipe(unzip);
                    nextStage = unzip;
                }
                nextStage.on('data', (buffer) => {
                    chunks.push(buffer);
                    chunkSize += buffer.byteLength;
                    if (bytesLength && chunkSize > (bytesOffset + bytesLength)) {
                        request.abort();
                        buffer = Buffer.concat(chunks);
                        logger_1.Logger.info(`Reading buffer success! ${buffer.byteLength}`);
                        return resolve(buffer.slice(bytesOffset, bytesOffset + bytesLength));
                    }
                }).on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    logger_1.Logger.info(`Reading buffer success! ${buffer.byteLength}`);
                    return resolve(buffer.slice(bytesOffset));
                }).on('error', (err) => {
                    const buffer = Buffer.concat(chunks);
                    logger_1.Logger.error(`Reading buffer error!`);
                    logger_1.Logger.warn(`Error message: ${err.message.toString()}`);
                    return resolve(buffer.slice(bytesOffset));
                });
            };
            logger_1.Logger.info(`\n Reading buffer from ${url} ...`);
            if (url.includes('https')) {
                request = https.get(url, res => requestHandler(res));
            }
            else {
                request = http.get(url, res => requestHandler(res));
            }
        });
    }
}
exports.FileHelper = FileHelper;
//# sourceMappingURL=file_helper.js.map
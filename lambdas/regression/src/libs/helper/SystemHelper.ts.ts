import * as fs from 'fs';
import * as path from 'path';
import * as parse from 'csv-parse';
import * as rimraf from 'rimraf';
import * as zlib from 'zlib';
import * as http from 'http';
import * as https from 'https';

export class SystemHelper {
    static async readNumericsFromCsv(filePath: string): Promise<Number[][]> {
        let csvData: any[] = [];
        return new Promise<any>((resolve, reject) => {
            fs.createReadStream(filePath).pipe(parse({delimiter: ','})).on('data', (csvrow: any) => {
                csvrow = csvrow.map(value => Number(value)); csvData.push(csvrow);        
            }).on('end', () => {resolve(csvData)}).on('error', (err) => {reject(err)});
        });
    }

    static async readNumericsFromBuffer(config: FileReaderConfig): Promise<number[]> {
        config = {...defaultFileReaderConfig, ...config};
        let index = config.bytesOffset!;
        let buffer = await this.readBuffer(config.path);
        let scaler = config.shouldScale ? 1 / (Math.pow(2, 8 * config.bytesStep!) - 1) : 1;

        let numerics: number[] = [];
        while (index < buffer.byteLength 
            && (config.numRecords ? index < (config.bytesOffset! + config.numRecords!) : true)) {
            numerics.push(buffer[
                `readUInt${8 * config.bytesStep!}${config.bytesStep! >= 2 ? 'BE' : ''}`
            ](index) * scaler);
            index += config.bytesStep!;
        }
        return numerics;
    }

    static async readBuffer(filePath: string): Promise<Buffer | any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {err ? reject(err) : resolve(data)});
        });
    }

    // Single threaded download only because Lambda compatible !!!
    static async downloadFile(url, destDirName: string = './tmp') {
        return new Promise((resolve, reject) => {
            let unzip = zlib.createGunzip();
            let writeStream = fs.createWriteStream(`${destDirName}/${getFileNameFromUrl(url)}`);
            console.log(`Downloading and Writing ${getFileNameFromUrl(url)} to ${destDirName}`);
            function callback(res) {
                if (url.includes('.gz')) {
                    res.pipe(unzip).pipe(writeStream);
                    unzip.on('end', () => {resolve()});
                }
                else {
                    res.pipe(writeStream);
                    res.on('end', () => {resolve()});
                }
            }
            if (url.includes('https')) https.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
            else http.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
        });
    }

    // Single threaded download only because Lambda compatible !!!
    static async downloadFiles(urls: string[], destDirName: string = './tmp') {
        if (!fs.existsSync(destDirName)) fs.mkdirSync(destDirName);
        for (let index = 0; index < urls.length; index++) {
            try {await this.downloadFile(urls[index], destDirName)}
            catch (e) {console.log(`Failed with error ${e}`)}
        }
    }

    static createDir(path: string): Boolean {
        if (!fs.existsSync(path)) {
            try {fs.mkdirSync(path)}
            catch (err) {return false}
        }
        return true;
    }

    static async removeDir(path): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            if (fs.existsSync(path)) {
                try {rimraf(path, () => {return resolve(true)})}
                catch (error) { return reject(error)}
            };
            return resolve(true);
        })
    }

    static listDirs = function(dirPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(dirPath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => fs.statSync(path.join(dirPath, item)).isDirectory()));
            });
        });
    }

    static listFiles = function(dirPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(dirPath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => !fs.statSync(path.join(dirPath, item)).isDirectory()));
            });
        });
    }
}

export class FileReaderConfig {
    path: string; 
    bytesOffset?: number; 
    bytesStep?: number;
    shouldScale?: boolean;
    numRecords?: number;
}

let defaultFileReaderConfig: FileReaderConfig = {
    path: '', 
    bytesOffset: 0, 
    bytesStep: 1,
    shouldScale: true,
}

function getFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.') < 0 ? url.length : url.lastIndexOf('.'));
}

import * as fs from 'fs';
import * as zlib from 'zlib';
import * as http from 'http';
import * as https from 'https';
import * as parse from 'csv-parse';
import {ConsoleColor} from '../model/common/ConsoleColor';

class FileReaderConfig {
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

class DataHelper {
    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }

    static async readNumericsFromCsv(path: string): Promise<any[]> {
        let csvData: any[] = [];
        return new Promise<any>((resolve, reject) => {
            fs.createReadStream(path).pipe(parse({delimiter: ','})).on('data', (csvrow: any) => {
                csvrow = csvrow.map(value => Number(value)); csvData.push(csvrow);        
            }).on('end', () => {resolve(csvData)}).on('error', (err) => {reject(err)});
        });
    }

    static async readBufferFromFile(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {err ? reject(err) : resolve(data)});
        });
    }

    static async downloadFileFromUrl(url, destDirName: string = './tmp'): Promise<any> {
        return new Promise((resolve, reject) => {
            let unzip = zlib.createGunzip();
            let writeStream = fs.createWriteStream(`${destDirName}/${getFileNameFromUrl(url)}`);
            console.log(ConsoleColor.Green, `Downloading and Writing ${getFileNameFromUrl(url)} to ${destDirName}`);
            function callback(res) {
                res.pipe(unzip).pipe(writeStream);
                unzip.on('end', () => {resolve()});
            }
            if (url.includes('https')) https.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
            else http.get(url, async(res) => {callback(res)}).on('error', (e) => {reject(e)});
        });
    }

    static async downloadFilesFromUrls(urls: string[], destDirName: string = './tmp'): Promise<any> {
        if (!fs.existsSync(destDirName)) fs.mkdirSync(destDirName)
        for (let index = 0; index < urls.length; index++) {
            try {await this.downloadFileFromUrl(urls[index], destDirName)}
            catch (e) {console.log(ConsoleColor.Red, `Failed with error ${e}`)}
        }
    }

    static async readNumericsFromFile(config: FileReaderConfig): Promise<number[]> {
        config = {...defaultFileReaderConfig, ...config};
        let index = config.bytesOffset!;
        let buffer = await this.readBufferFromFile(config.path);
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

    // Shuffles data and label using Fisher-Yates algorithm.
    static shuffleDataset(featureArray, labelArray) {
        let counter = featureArray.length;
        let temp = 0;
        let index = 0;
        while (counter > 0) {
            index = (Math.random() * counter) | 0;
            counter--;
            // Shuffle featureArray:
            temp = featureArray[counter];
            featureArray[counter] = featureArray[index];
            featureArray[index] = temp;
            // Shuffle labelArray:
            temp = labelArray[counter];
            labelArray[counter] = labelArray[index];
            labelArray[index] = temp;
        }
    }
}

function getFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1, url.indexOf('.') < 0 ? url.length : url.lastIndexOf('.'));
}

Object.seal(DataHelper);
export default DataHelper;
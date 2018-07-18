import * as path from 'path';
import * as fs from 'fs';
import {URL} from 'url';

class FileHelper {
    static async getFromUrl(url: string) {
        let fileUrl = new URL(url);
        return new Promise((resolve, reject) => {
            fs.readFile(fileUrl, (error, data) => {
                if (error) return reject(error);
                resolve(data);
            });
        });
    }

    static getDirectories = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getDirectoriesSync = function(sourcePath: string): string[] {
        return fs.readdirSync(sourcePath).filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory());
    }

    static getFiles = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getFilesSync = function(sourcePath: string): string[] {
        return fs.readdirSync(sourcePath).filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory());
    }
}

Object.seal(FileHelper);
export default FileHelper;

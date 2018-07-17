import * as path from 'path';
import * as fs from 'fs';

class FileHelper {
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

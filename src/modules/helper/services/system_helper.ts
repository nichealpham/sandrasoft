// Import external-modules
import * as fs from 'fs';
import * as rimraf from 'rimraf';

// Import peer-modules
// Import sub-moudles
export class SystemHelper {
    static dirExist(path: string): boolean {
        return fs.existsSync(path);
    }

    static isDir(path: string): boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }

    static createDir(path: string): boolean {
        if (!this.dirExist(path)) {
            fs.mkdirSync(path, {recursive: true});
        }
        return true;
    }

    static removeDir(path: string): boolean {
        rimraf.sync(path);
        return true;
    }

    static async writeBuffer(fullPath: string, data: Buffer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, data, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }

    static async readBuffer(fullPath: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}
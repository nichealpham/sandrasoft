"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const rimraf = require("rimraf");
class SystemHelper {
    static dirExist(path) {
        return fs.existsSync(path);
    }
    static isDir(path) {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }
    static createDir(path) {
        if (!this.dirExist(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        return true;
    }
    static removeDir(path) {
        rimraf.sync(path);
        return true;
    }
    static async writeBuffer(fullPath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, data, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }
    static async readBuffer(fullPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}
exports.SystemHelper = SystemHelper;
//# sourceMappingURL=system_helper.js.map
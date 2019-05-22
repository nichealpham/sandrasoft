"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_code_1 = require("./color_code");
class Logger {
    constructor(config) {
    }
    static debug(message) {
        console.log(color_code_1.ColorCode.debug, message);
    }
    static info(message) {
        console.log(color_code_1.ColorCode.info, message);
    }
    static success(message) {
        console.log(color_code_1.ColorCode.success, message);
    }
    static warn(message) {
        console.log(color_code_1.ColorCode.warn, message);
    }
    static error(message) {
        console.log(color_code_1.ColorCode.error, message);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map
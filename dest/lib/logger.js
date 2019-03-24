"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeLogger = require('simple-node-logger');
class Logger {
    static init(config) {
        if (config.logFilePath) {
            this.logger = NodeLogger.createSimpleLogger({
                logFilePath: config.logFilePath,
                timestampFormat: config.logFilePath || 'YYYY-MM-DD HH:mm:ss',
            });
        }
    }
    static debug(message) {
        if (this.logger) {
            this.logger.debug(message);
        }
    }
    static info(message) {
        if (this.logger) {
            this.logger.info(message);
        }
    }
    static warn(message) {
        if (this.logger) {
            this.logger.warn(message);
        }
    }
    static error(message) {
        if (this.logger) {
            this.logger.error(message);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map
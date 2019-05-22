// Import external-modules
const nodeLogger = require('simple-node-logger');

// Import peer-modules
// Import sub-modules
import { LoggerConfig } from './interfaces/logger_config';
import { ColorCode } from './color_code';

class Logger {
    /* @todo
    // init connection to elastic search */
    constructor(config: LoggerConfig) {
        nodeLogger.createSimpleLogger({
            logFilePath: config.logFilePath,
            timestampFormat: config.timestampFormat || 'YYYY-MM-DD HH:mm:ss',
        });
    }
    static debug(message: string) {
        console.log(ColorCode.debug, message);
    }
    static info(message: string) {
        console.log(ColorCode.info, message);
    }
    static success(message: string) {
        console.log(ColorCode.success, message);
    }
    static warn(message: string) {
        console.log(ColorCode.warn, message);
    }
    static error(message: string) {
        /* @todo
        // logging to elastic search */
        console.log(ColorCode.error, message);
    }
}

export {
    LoggerConfig,
    Logger,
};
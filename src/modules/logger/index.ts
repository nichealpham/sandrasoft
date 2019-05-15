// Import external-modules
const nodeLogger = require('simple-node-logger');

// Import peer-modules
// Import sub-modules
import { LoggerConfig } from './interfaces/logger_config';

class Logger {
    static logger;
    static init(config: LoggerConfig) {
        if (config.logFilePath) {
            this.logger = nodeLogger.createSimpleLogger({
                logFilePath: config.logFilePath,
                timestampFormat: config.logFilePath || 'YYYY-MM-DD HH:mm:ss',
            });
        }
    }
    static debug(message: string) {
        if (this.logger) {
            this.logger.debug(message);
        }
    }
    static info(message: string) {
        if (this.logger) {
            this.logger.info(message);
        }
    }
    static warn(message: string) {
        if (this.logger) {
            this.logger.warn(message);
        }
    }
    static error(message: string) {
        if (this.logger) {
            this.logger.error(message);
        }
    }
}

export {
    LoggerConfig,
    Logger,
};
const NodeLogger = require('simple-node-logger');

export class Logger {
    static logger: any;

    static init(config: ILoggerConfig) {
        if (config.logFilePath) {
            this.logger = NodeLogger.createSimpleLogger({
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

export interface ILoggerConfig {
    logFilePath: String,
    timestampFormat: String,
}
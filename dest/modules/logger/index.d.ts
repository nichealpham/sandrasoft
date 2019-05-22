import { LoggerConfig } from './interfaces/logger_config';
declare class Logger {
    constructor(config: LoggerConfig);
    static debug(message: string): void;
    static info(message: string): void;
    static success(message: string): void;
    static warn(message: string): void;
    static error(message: string): void;
}
export { LoggerConfig, Logger, };

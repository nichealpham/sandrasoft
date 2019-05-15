import { LoggerConfig } from './interfaces/logger_config';
declare class Logger {
    static logger: any;
    static init(config: LoggerConfig): void;
    static debug(message: string): void;
    static info(message: string): void;
    static warn(message: string): void;
    static error(message: string): void;
}
export { LoggerConfig, Logger, };

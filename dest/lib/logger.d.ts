export declare class Logger {
    static logger: any;
    static init(config: ILoggerConfig): void;
    static debug(message: string): void;
    static info(message: string): void;
    static warn(message: string): void;
    static error(message: string): void;
}
export interface ILoggerConfig {
    logFilePath: String;
    timestampFormat: String;
}

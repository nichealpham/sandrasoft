export interface ServerConfig {
    apiRoot: string;
    hostName?: string;
    port: number;
    remoting?: {
        cors?: {
            origin: string | string[],
            optionsSuccessStatus: number,
        },
        json?: {
            strict: boolean,
            limit: string,
        },
        urlencoded?: {
            extended: boolean,
            limit: string,
        },
        logger?: {
            logFilePath: string,
            timestampFormat: string,
        }
        rest?: {
            errorHandler: {
                fieldName: string,
                writeLog: boolean,
            },
            successHandler: {
                fieldName: string,
                writeLog: boolean,
            },
            convertNullToError: boolean,
        }
    };
}
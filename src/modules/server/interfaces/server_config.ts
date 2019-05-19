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

export const defaultServerConfig: ServerConfig = {
    apiRoot: "/api",
    hostName: "sandrasoft.com",
    port: 3000,
    remoting: {
        cors: {
            origin: "*",
            optionsSuccessStatus: 200,
        },
        json: {
            strict: true,
            limit: "200mb",
        },
        urlencoded: {
            extended: true,
            limit: "100kb",
        },
        logger: {
            logFilePath: "",
            timestampFormat: "YYYY-MM-DD HH:mm:ss",
        },
        rest: {
            errorHandler: {
                fieldName: "error",
                writeLog: true,
            },
            successHandler: {
                fieldName: "body",
                writeLog: true,
            },
            convertNullToError: true,
        },
    },
};
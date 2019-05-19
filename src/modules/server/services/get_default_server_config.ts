// Import sub-modules
import { ServerConfig } from "../interfaces/server_config";

export const getDefaultServerConfig = (): ServerConfig => {
    return JSON.parse(JSON.stringify({
        apiRoot: "/api",
        hostName: "localhost",
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
                timestampFormat: "",
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
    }));
};
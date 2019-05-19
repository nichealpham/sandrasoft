"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultServerConfig = () => {
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
    }));
};
//# sourceMappingURL=get_default_server_config.js.map
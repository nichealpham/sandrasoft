"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const ramda = require("ramda");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger_1 = require("../logger");
const ParseRequestValidation_1 = require("./modules/ParseRequestValidation");
const GetDefaultServerConfig_1 = require("./modules/GetDefaultServerConfig");
const ParseRequestHandler_1 = require("./modules/ParseRequestHandler");
const error_1 = require("../error");
class SandraCore {
    constructor(config) {
        this._routeCounter = 0;
        const serverConfig = ramda.mergeRight(GetDefaultServerConfig_1.getDefaultServerConfig(), config);
        this.serverConfig = serverConfig;
        this.server = this.createServer();
        if (this.serverConfig.router) {
            this.applyRoutes(this.serverConfig.router);
        }
    }
    createServer() {
        const server = express();
        try {
            server.use(cookieParser());
            server.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
            server.use(bodyParser.json({ strict: true, limit: "200mb" }));
            server.use(bodyParser.urlencoded({ extended: true, limit: "400kb" }));
        }
        catch (err) {
            throw new error_1.errorServerCreate(err.message);
        }
        return server;
    }
    applyRoutes(routes) {
        const rounter = express.Router();
        for (const routeName of Object.keys(routes)) {
            const routeConfig = routes[routeName];
            for (const path of routeConfig.paths) {
                const method = routeConfig.method.toLowerCase();
                const fullPath = `${this.serverConfig.apiRoot}${path}`;
                const middlewares = routeConfig.middlewares || [];
                const pathName = `${++this._routeCounter}. ${routeName}: ` +
                    `${method} => ${fullPath}`;
                if (routeConfig.validations) {
                    const validationMiddleware = ParseRequestValidation_1.parseRequestValidations(routeConfig.validations);
                    middlewares.push(validationMiddleware);
                }
                rounter.route(path)[method](...middlewares, ParseRequestHandler_1.parseRequestHandler({
                    pathName,
                    routeConfig,
                }));
                logger_1.Logger.info(`${pathName}`);
            }
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }
    async startListening() {
        logger_1.Logger.info(`Starting server ... `);
        let app = http.createServer(this.getInstance());
        if (this.serverConfig.useHttps) {
            const options = {
                key: fs.readFileSync(this.serverConfig.useHttps.keyFilePath),
                cert: fs.readFileSync(this.serverConfig.useHttps.certFilePath),
                passphrase: this.serverConfig.useHttps.passphrase,
            };
            app = https.createServer(options, this.getInstance());
        }
        app.listen(this.serverConfig.port);
        app.on('listening', () => {
            const addr = app.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            logger_1.Logger.info(`Server is listenning on port ${bind} `);
        });
    }
    use(middleware) {
        this.server.use(middleware);
    }
    set(engineName, engineConfig) {
        this.server.set(engineName, engineConfig);
    }
    getServerConfig() {
        return this.serverConfig;
    }
    getInstance() {
        return this.server;
    }
}
exports.SandraCore = SandraCore;
//# sourceMappingURL=index.js.map
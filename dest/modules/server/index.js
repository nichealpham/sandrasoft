"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const ramda = require("ramda");
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("../logger");
const error_1 = require("../error");
const parse_request_validatons_1 = require("./services/parse_request_validatons");
const get_default_server_config_1 = require("./services/get_default_server_config");
const parse_request_handler_1 = require("./services/parse_request_handler");
const parse_middlewares_1 = require("./services/parse_middlewares");
class Server {
    constructor(config) {
        this._routeCounter = 0;
        const serverConfig = ramda.mergeDeepRight(get_default_server_config_1.getDefaultServerConfig(), config);
        this.server = this.createServer(serverConfig);
        this.serverConfig = serverConfig;
    }
    createServer(config) {
        const server = express();
        try {
            if (config.remoting) {
                if (config.remoting.cors) {
                    server.use(cors(config.remoting.cors));
                }
                if (config.remoting.json) {
                    server.use(bodyParser.json(config.remoting.json));
                }
                if (config.remoting.urlencoded) {
                    server.use(bodyParser.urlencoded(config.remoting.urlencoded));
                }
                if (config.remoting.logger) {
                    logger_1.Logger.init(config.remoting.logger);
                }
            }
        }
        catch (err) {
            throw new error_1.errorServerCreate(err.message.toString());
        }
        return server;
    }
    applyMiddleware(middleware) {
        try {
            this.server.use(middleware);
        }
        catch (err) {
            throw new error_1.errorServerApplyMiddleware(err.message.toString());
        }
    }
    applyRoutes(routes) {
        const rounter = express.Router();
        logger_1.Logger.info(`API endpoints: `);
        for (const routeName of Object.keys(routes)) {
            const routeConfig = routes[routeName];
            for (const path of routeConfig.paths) {
                const method = routeConfig.method.toLowerCase();
                const fullPath = `${this.serverConfig.apiRoot}${path}`;
                const middlewares = parse_middlewares_1.parseMiddlewares(routeConfig.middlewares);
                const pathName = `${++this._routeCounter}. ${routeName}: ` +
                    `${method} => ${fullPath}`;
                if (routeConfig.validations) {
                    const validationMiddleware = parse_request_validatons_1.parseRequestValidations(routeConfig.validations);
                    middlewares.push(validationMiddleware);
                }
                rounter.route(path)[method](...middlewares, parse_request_handler_1.parseRequestHandler({
                    pathName,
                    routeConfig,
                    serverConfig: this.serverConfig,
                }));
                logger_1.Logger.info(`${pathName}`);
            }
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }
    async startListening() {
        logger_1.Logger.info(`Starting server ... `);
        return new Promise((resolve, reject) => {
            try {
                this.server.listen(this.serverConfig.port, () => {
                    logger_1.Logger.info(`Server is listenning on port ${this.serverConfig.port} `);
                    return resolve(true);
                });
            }
            catch (err) {
                return reject(new error_1.errorServerStartListenning(err.message.toString()));
            }
        });
    }
    getServerConfig() {
        return this.serverConfig;
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map
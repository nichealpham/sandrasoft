"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("../logger");
class Server {
    constructor(config) {
        this._routeCounter = 0;
        this.server = this.createServer(config);
        this.serverConfig = config;
    }
    createServer(config) {
        const server = express();
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
        return server;
    }
    applyMiddleware(middleware) {
        this.server.use(middleware);
    }
    applyRoutes(routes) {
        const rounter = express.Router();
        logger_1.Logger.info(`API endpoints: `);
        for (const routeName of Object.keys(routes)) {
            const routeConfig = routes[routeName];
            const fullUrl = `${this.serverConfig.apiRoot}${routeConfig.url}`;
            const routePath = `${++this._routeCounter}. ${routeName}: ${routeConfig.method.toUpperCase()} => ${fullUrl}`;
            logger_1.Logger.info(`${routePath}`);
            rounter.route(routeConfig.url)[routeConfig.method.toLowerCase()](...(routeConfig.validators || []), async (req, res) => {
                const params = {};
                const paramsConfig = routeConfig.params || {};
                for (const paramName of Object.keys(paramsConfig)) {
                    const steps = paramsConfig[paramName].split('.');
                    let value = req;
                    for (let i = 1; i < steps.length; i++) {
                        value = value[steps[i]];
                    }
                    params[paramName] = value;
                }
                let errorMessage = '';
                let response = {
                    statusCode: 500,
                };
                const result = await routeConfig.controller(params).catch((err) => {
                    errorMessage = err.toString();
                });
                if (errorMessage) {
                    if (this.serverConfig.remoting &&
                        this.serverConfig.remoting.rest &&
                        this.serverConfig.remoting.rest.errorHandler &&
                        this.serverConfig.remoting.rest.errorHandler.fieldName) {
                        response.statusCode = 500;
                        response[this.serverConfig.remoting.rest.errorHandler.fieldName] = errorMessage;
                    }
                    else {
                        response = {
                            statusCode: 500,
                            message: 'Internal Server Error',
                        };
                    }
                    if (this.serverConfig.remoting &&
                        this.serverConfig.remoting.rest &&
                        this.serverConfig.remoting.rest.errorHandler &&
                        this.serverConfig.remoting.rest.errorHandler.writeLog) {
                        logger_1.Logger.error(`API Error: ${routePath} `);
                        logger_1.Logger.error(`Message: ${errorMessage} `);
                    }
                }
                else {
                    if (!result &&
                        this.serverConfig.remoting &&
                        this.serverConfig.remoting.rest &&
                        this.serverConfig.remoting.rest.convertNullToError) {
                        response = {
                            statusCode: 400,
                            message: 'Data cannot be found',
                        };
                    }
                    else {
                        if (this.serverConfig.remoting &&
                            this.serverConfig.remoting.rest &&
                            this.serverConfig.remoting.rest.successHandler &&
                            this.serverConfig.remoting.rest.successHandler.fieldName) {
                            response.statusCode = 200;
                            response[this.serverConfig.remoting.rest.successHandler.fieldName] = result;
                        }
                        else {
                            response = {
                                statusCode: 200,
                                data: result,
                            };
                        }
                    }
                    if (this.serverConfig.remoting &&
                        this.serverConfig.remoting.rest &&
                        this.serverConfig.remoting.rest.successHandler &&
                        this.serverConfig.remoting.rest.successHandler.writeLog) {
                        logger_1.Logger.info(`API Success: ${routeName} `);
                        logger_1.Logger.info(`Result: ${JSON.stringify(result)} `);
                    }
                }
                return res.json(response);
            });
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }
    async startListening() {
        logger_1.Logger.info(`Starting server ... `);
        return new Promise((resolve) => {
            this.server.listen(this.serverConfig.port, () => {
                logger_1.Logger.info(`Server is listenning on port ${this.serverConfig.port} `);
                return resolve(true);
            });
        });
    }
    getServerConfig() {
        return this.serverConfig;
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map
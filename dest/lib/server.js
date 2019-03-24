"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const logger_1 = require("./logger");
class SandraCore {
    constructor(config) {
        this._routeCounter = 0;
        this.server = this.createServer(config);
        this.serverConfig = config;
    }
    createServer(config) {
        let server = express();
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
        logger_1.Logger.info(`API endpoints: `);
        let rounter = express.Router();
        routes.forEach(route => {
            this._routeCounter += 1;
            let fullUrl = `${this.serverConfig.apiRoot}${route.url}`;
            let routeName = `${this._routeCounter}. ${route.method.toUpperCase()} => ${fullUrl}`;
            rounter.route(route.url)[route.method.toLowerCase()](...route.validators, async (req, res) => {
                let response = {};
                let errorMessage = '';
                let result = await route.controller(req).catch((err) => {
                    errorMessage = err.toString();
                });
                if (errorMessage) {
                    if (this.serverConfig.remoting.rest.errorHandler.fieldName) {
                        response.statusCode = 500;
                        response[this.serverConfig.remoting.rest.errorHandler.fieldName] = errorMessage;
                    }
                    else {
                        response = {
                            statusCode: 500,
                            message: 'Internal Server Error'
                        };
                    }
                    if (this.serverConfig.remoting.rest.errorHandler.writeLog) {
                        logger_1.Logger.error(`API Error: ${routeName} `);
                        logger_1.Logger.error(`Message: ${errorMessage} `);
                    }
                }
                else {
                    if (!result && this.serverConfig.remoting.rest.convertNullToError) {
                        response = {
                            statusCode: 400,
                            message: 'Data cannot be found'
                        };
                    }
                    else {
                        if (this.serverConfig.remoting.rest.successHandler.fieldName) {
                            response.statusCode = 200;
                            response[this.serverConfig.remoting.rest.successHandler.fieldName] = result;
                        }
                        else {
                            response = {
                                statusCode: 200,
                                data: result
                            };
                        }
                    }
                    if (this.serverConfig.remoting.rest.successHandler.writeLog) {
                        logger_1.Logger.info(`API Success: ${routeName} `);
                        logger_1.Logger.info(`Result: ${JSON.stringify(result)} `);
                    }
                }
                return res.json(response);
            });
            logger_1.Logger.info(`${routeName}`);
        });
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
exports.SandraCore = SandraCore;
//# sourceMappingURL=server.js.map
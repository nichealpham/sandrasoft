// Import external-modules
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

// Import peer-modules
import { Logger } from '../logger';

// Import sub-modules
import { ServerConfig } from './interfaces/server_config';
import { ServerRoute } from './interfaces/server_route';

class Server {
    private server: express.Application;
    private serverConfig: ServerConfig;
    private _routeCounter = 0;

    constructor(config: ServerConfig) {
        this.server = this.createServer(config);
        this.serverConfig = config;
    }

    private createServer(config: ServerConfig): express.Application {
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
                Logger.init(config.remoting.logger);
            }
        }
        return server;
    }

    applyMiddleware(middleware: express.RequestHandler) {
        this.server.use(middleware);
    }

    applyRoutes(routes: {[key: string]: ServerRoute}) {
        const rounter = express.Router();
        Logger.info(`API endpoints: `);

        for (const routeName of Object.keys(routes)) {

            const routeConfig = routes[routeName];
            const fullUrl = `${this.serverConfig.apiRoot}${routeConfig.url}`;
            const routePath = `${++this._routeCounter}. ${routeName}: ${routeConfig.method.toUpperCase()} => ${fullUrl}`;

            Logger.info(`${routePath}`);
            rounter.route(routeConfig.url)[routeConfig.method.toLowerCase()](
                ...(routeConfig.validators || []),
                async (req: Request, res: Response) => {
                    const params: {[key: string]: object | string | number} = {};
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
                    let response: {
                        statusCode: number, 
                        [addtionalField: string]: object | string | number
                    } = {
                        statusCode: 500,
                    };
                    const result = await routeConfig.controller(params).catch((err: Error) => {
                        errorMessage = err.toString();
                    });
                    if (errorMessage) {
                        if (this.serverConfig.remoting &&
                            this.serverConfig.remoting.rest &&
                            this.serverConfig.remoting.rest.errorHandler &&
                            this.serverConfig.remoting.rest.errorHandler.fieldName
                        ) {
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
                            this.serverConfig.remoting.rest.errorHandler.writeLog
                        ) {
                            Logger.error(`API Error: ${routePath} `);
                            Logger.error(`Message: ${errorMessage} `);
                        }
                    }
                    else {
                        if (!result && 
                            this.serverConfig.remoting &&
                            this.serverConfig.remoting.rest &&
                            this.serverConfig.remoting.rest.convertNullToError
                        ) {
                            response = {
                                statusCode: 400,
                                message: 'Data cannot be found',
                            };
                        }
                        else {
                            if (this.serverConfig.remoting &&
                                this.serverConfig.remoting.rest &&
                                this.serverConfig.remoting.rest.successHandler &&
                                this.serverConfig.remoting.rest.successHandler.fieldName
                            ) {
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
                            this.serverConfig.remoting.rest.successHandler.writeLog
                        ) {
                            Logger.info(`API Success: ${routeName} `);
                            Logger.info(`Result: ${JSON.stringify(result)} `);
                        }
                    }
                    return res.json(response);
                }
            );
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }

    async startListening(): Promise<boolean> {
        Logger.info(`Starting server ... `);

        return new Promise<boolean>((resolve) => {
            this.server.listen(this.serverConfig.port, () => {
                Logger.info(`Server is listenning on port ${this.serverConfig.port} `);
                return resolve(true);
            });
        });
    }

    getServerConfig() {
        return this.serverConfig;
    }
}

export { 
    ServerConfig,
    ServerRoute,
    Server
};

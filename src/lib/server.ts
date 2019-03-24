import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger } from './logger';
import { Request, Response } from 'express';

export class SandraCore {
    private _routeCounter: number = 0;
    
    private server: express.Application;
    private serverConfig: IServerConfig;

    constructor(config: IServerConfig) {
        this.server = this.createServer(config);
        this.serverConfig = config;
    }

    private createServer(config: IServerConfig): express.Application {
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
                Logger.init(config.remoting.logger);
            }
        }
        return server;
    }

    public applyMiddleware(middleware: express.RequestHandler) {
        this.server.use(middleware);
    }

    public applyRoutes(routes: IServerRoute[]) {
        Logger.info(`API endpoints: `);
        let rounter = express.Router();

        routes.forEach(route => {
            this._routeCounter += 1;

            let fullUrl = `${this.serverConfig.apiRoot}${route.url}`;
            let routeName = `${this._routeCounter}. ${route.method.toUpperCase()} => ${fullUrl}`;

            rounter.route(route.url)[route.method.toLowerCase()](
                ...route.validators,
                async (req: Request, res: Response) => {
                    let response: any = {};
                    let errorMessage: string = '';

                    let result = await route.controller(req).catch((err: Error) => {
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
                            }
                        }
                        if (this.serverConfig.remoting.rest.errorHandler.writeLog) {
                            Logger.error(`API Error: ${routeName} `);
                            Logger.error(`Message: ${errorMessage} `);
                        }
                    }
                    else {
                        if (!result && this.serverConfig.remoting.rest.convertNullToError) {
                            response = {
                                statusCode: 400,
                                message: 'Data cannot be found'
                            }
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
                                }
                            }
                        }
                        if (this.serverConfig.remoting.rest.successHandler.writeLog) {
                            Logger.info(`API Success: ${routeName} `);
                            Logger.info(`Result: ${JSON.stringify(result)} `);
                        }
                    }
                    return res.json(response);
                }
            );
            Logger.info(`${routeName}`);
        });
        this.server.use(this.serverConfig.apiRoot, rounter);
    }

    public async startListening(): Promise<boolean> {
        Logger.info(`Starting server ... `);

        return new Promise<boolean>((resolve) => {
            this.server.listen(this.serverConfig.port, () => {
                Logger.info(`Server is listenning on port ${this.serverConfig.port} `);
                return resolve(true);
            });
        });
    }

    public getServerConfig() {
        return this.serverConfig;
    }
}

export interface IServerConfig {
    apiRoot: string,
    hostName: string,
    port: number,
    swagger: {
        url: string,
        enableUI: boolean,
        spec: any
    },
    remoting: {
        cors: {
            origin: string | string[],
            optionsSuccessStatus: number,
        },
        json: {
            strict: boolean,
            limit: string,
        },
        urlencoded: {
            extended: boolean,
            limit: string,
        },
        logger: {
            logFilePath: string,
            timestampFormat: string,
        }
        rest: {
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
    }
}

export interface IServerRoute {
    method: string,
    url: string,
    validators: Function[],
    controller: Function,
}
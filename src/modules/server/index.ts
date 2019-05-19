// Import external-modules
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

// Import peer-modules
import { Logger } from '../logger';
import { errorServerCreate, errorServerApplyMiddleware, errorServerStartListenning } from '../error';

// Import sub-modules
import { ServerConfig } from './interfaces/server_config';
import { ServerRoute } from './interfaces/server_route';
import { parseMiddlewares } from './parse-middlewares';
import { parseServiceHandler } from './parse_service_handler';

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
                    Logger.init(config.remoting.logger);
                }
            }
        } catch (err) {
            throw new errorServerCreate(err.message.toString());
        }
        return server;
    }

    applyMiddleware(middleware: express.RequestHandler) {
        try {
            this.server.use(middleware);
        } catch (err) {
            throw new errorServerApplyMiddleware(err.message.toString());
        }
    }

    applyRoutes(routes: {[routeName: string]: ServerRoute}) {
        const rounter = express.Router();
        Logger.info(`API endpoints: `);
        for (const routeName of Object.keys(routes)) {

            const routeConfig = routes[routeName];
            for (const path of routeConfig.paths) {

                const method = routeConfig.method.toLowerCase();
                const fullPath = `${this.serverConfig.apiRoot}${path}`;
                const middlewares = parseMiddlewares(routeConfig.middlewares);
                const pathName = 
                    `${++this._routeCounter}. ${routeName}: ` + 
                    `${routeConfig.method.toUpperCase()} => ${fullPath}`;
                
                Logger.info(`${pathName}`);
                rounter.route(path)[method](...middlewares,
                    parseServiceHandler()
                );
            }
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }

    async startListening(): Promise<boolean> {
        Logger.info(`Starting server ... `);
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.server.listen(this.serverConfig.port, () => {
                    Logger.info(`Server is listenning on port ${this.serverConfig.port} `);
                    return resolve(true);
                });
            } catch (err) {
                return reject(new errorServerStartListenning(err.message.toString()));
            }
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

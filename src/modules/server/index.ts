// Import external-modules
import * as cors from 'cors';
import * as ramda from 'ramda';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Import peer-modules
import { Logger } from '../logger';
import { errorServerCreate, errorServerApplyMiddleware, errorServerStartListenning } from '../error';

// Import sub-modules
import { ServerConfig } from './interfaces/server_config';
import { ServerRoute } from './interfaces/server_route';
import { parseRequestValidations } from './services/parse_request_validatons';
import { getDefaultServerConfig } from './services/get_default_server_config';
import { parseRequestHandler } from './services/parse_request_handler';
import { parseMiddlewares } from './services/parse_middlewares';

class Server {
    private server: express.Application;
    private serverConfig: ServerConfig;
    private _routeCounter = 0;

    constructor(config: ServerConfig) {
        const serverConfig = ramda.mergeDeepRight(getDefaultServerConfig(), config);
        this.server = this.createServer(serverConfig);
        this.serverConfig = serverConfig;
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
            }
        } catch (err) {
            throw new errorServerCreate(err.message.toString());
        }
        return server;
    }

    applyMiddleware(middleware: (req: express.Request, res: express.Response, next: express.NextFunction) => void) {
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
                    `${method} => ${fullPath}`;
                
                if (routeConfig.validations) {
                    const validationMiddleware = parseRequestValidations(
                        routeConfig.validations
                    );
                    middlewares.push(validationMiddleware);
                }
                rounter.route(path)[method](...middlewares,
                    parseRequestHandler({
                        pathName, 
                        routeConfig, 
                        serverConfig: this.serverConfig,
                    })
                );
                Logger.success(`${pathName}`);
            }
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }

    async startListening(): Promise<boolean> {
        Logger.info(`Starting server ... `);
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.server.listen(this.serverConfig.port, () => {
                    Logger.success(`Server is listenning on port ${this.serverConfig.port} `);
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

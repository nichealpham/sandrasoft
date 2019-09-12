import * as fs from 'fs';
import * as cors from 'cors';
import * as http from 'http';
import * as https from 'https';
import * as ramda from 'ramda';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Logger } from '../logger';
import { ServerConfig } from './interfaces/ServerConfig';
import { ServerRoute } from './interfaces/ServerRoute';
import { parseRequestValidations } from './modules/ParseRequestValidation';
import { getDefaultServerConfig } from './modules/GetDefaultServerConfig';
import { parseRequestHandler } from './modules/ParseRequestHandler';
import { errorServerCreate } from '../error';

class SandraCore {
    private server: express.Application;
    private serverConfig: ServerConfig;
    private _routeCounter = 0;

    constructor(config: ServerConfig) {
        const serverConfig = ramda.mergeRight(getDefaultServerConfig(), config);
        this.serverConfig = serverConfig;
        this.server = this.createServer();
        if (this.serverConfig.router) {
            this.applyRoutes(this.serverConfig.router);
        }
    }

    private createServer(): express.Application {
        const server = express();
        try {
            server.use(cookieParser());
            server.use(cors({origin: "*", optionsSuccessStatus: 200}));
            server.use(bodyParser.json({strict: true, limit: "200mb"}));
            server.use(bodyParser.urlencoded({extended: true, limit: "400kb"}));
        } catch (err) {
            throw new errorServerCreate(err.message);
        }
        return server;
    }

    applyRoutes(routes: {[routeName: string]: ServerRoute}) {
        const rounter = express.Router();
        for (const routeName of Object.keys(routes)) {

            const routeConfig = routes[routeName];
            for (const path of routeConfig.paths) {
                
                const method = routeConfig.method.toLowerCase();
                const fullPath = `${this.serverConfig.apiRoot}${path}`;
                const middlewares = routeConfig.middlewares || [];
                
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
                    })
                );
                Logger.info(`${pathName}`);
            }
        }
        this.server.use(this.serverConfig.apiRoot, rounter);
    }

    async startListening() {
        Logger.info(`Starting server ... `);
        let app = http.createServer(this.getInstance());
        if (this.serverConfig.useHttps) {
            const options = {
                key: fs.readFileSync(this.serverConfig.useHttps.keyFilePath),
                cert: fs.readFileSync(this.serverConfig.useHttps.certFilePath),
                passphrase: this.serverConfig.useHttps.passphrase,
            };
            app =  https.createServer(options, this.getInstance());
        }
        app.listen(this.serverConfig.port);
        app.on('listening', () => {
            const addr = app.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr!.port;
            Logger.info(`Server is listenning on port ${bind} `);
        });
    }

    // expose method express.use()
    use(middleware: (req: express.Request, res: express.Response, next: express.NextFunction) => void) {
        this.server.use(middleware);
    }

    // expose method express.set()
    set(engineName: string, engineConfig: string) {
        this.server.set(engineName, engineConfig);
    }

    // get configuration of this server
    getServerConfig() {
        return this.serverConfig;
    }

    // get express instance of this server
    getInstance() {
        return this.server;
    }
}

export { 
    ServerConfig as SandraCoreConfig,
    ServerRoute as SandraCoreRoute,
    SandraCore,
};

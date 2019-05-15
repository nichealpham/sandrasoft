import * as express from 'express';
import { ServerConfig } from './interfaces/server_config';
import { ServerRoute } from './interfaces/server_route';
declare class Server {
    private server;
    private serverConfig;
    private _routeCounter;
    constructor(config: ServerConfig);
    private createServer;
    applyMiddleware(middleware: express.RequestHandler): void;
    applyRoutes(routes: {
        [key: string]: ServerRoute;
    }): void;
    startListening(): Promise<boolean>;
    getServerConfig(): ServerConfig;
}
export { ServerConfig, ServerRoute, Server };

import * as express from 'express';
import { ServerConfig } from './interfaces/ServerConfig';
import { ServerRoute } from './interfaces/ServerRoute';
declare class SandraCore {
    private server;
    private serverConfig;
    private _routeCounter;
    constructor(config: ServerConfig);
    private createServer;
    applyRoutes(routes: {
        [routeName: string]: ServerRoute;
    }): void;
    startListening(): Promise<void>;
    use(middleware: (req: express.Request, res: express.Response, next: express.NextFunction) => void): void;
    set(engineName: string, engineConfig: string): void;
    getServerConfig(): ServerConfig;
    getInstance(): express.Application;
}
export { ServerConfig as SandraCoreConfig, ServerRoute as SandraCoreRoute, SandraCore, };

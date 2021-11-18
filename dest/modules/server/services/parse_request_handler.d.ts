import { Request, Response } from 'express';
import { ServerRoute } from '../interfaces/server_route';
import { ServerConfig } from '../interfaces/server_config';
export declare const parseRequestHandler: (input: {
    pathName: string;
    routeConfig: ServerRoute;
    serverConfig: ServerConfig;
}) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;

import { Request, Response } from 'express';
import { ServerRoute } from '../interfaces/ServerRoute';
export declare const parseRequestHandler: (input: {
    pathName: string;
    routeConfig: ServerRoute;
}) => (req: Request, res: Response) => Promise<import("express-serve-static-core").Response>;

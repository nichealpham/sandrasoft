import { Request, Response } from 'express';
import { ServerRoute } from '../interfaces/ServerRoute';
import { Logger } from '../../logger';

export const parseRequestHandler = (input: {
    pathName: string,
    routeConfig: ServerRoute,
}) => {
    return async (req: Request, res: Response) => {
        let errorMessage = '';

        const { pathName, routeConfig } = input;
        const response: {
            statusCode: number, 
            [addtionalField: string]: object | string | number | Buffer | null | undefined | void | boolean
        } = {
            statusCode: 500,
        };

        const result = await routeConfig.controller(req).catch(err => {
            errorMessage = err.message;
        });

        const errorFieldName = 'error';
        const successFieldName = 'data';

        if (errorMessage) {
            response.statusCode = 500;
            response[errorFieldName] = errorMessage;
            Logger.error(`API Error: ${pathName} `);
            Logger.debug(`Message: ${errorMessage} `);
        } else {
            if (!result) {
                response.statusCode = 400;
                response[errorFieldName] = 'Data cannot be found';
            } else {
                response.statusCode = 200;
                response[successFieldName] = result;
            }
            Logger.info(`API Success: ${pathName} `);
            Logger.debug(`Result: ${JSON.stringify(result)} `);
        }
        return res.json(response);
    };
};
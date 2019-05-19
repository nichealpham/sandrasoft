// Import external-modules
import { Request, Response } from 'express';
import * as Ramda from 'ramda';

// Import peer-modules
import { Logger } from '../../logger';

// Import sub-modules
import { ServerRoute } from '../interfaces/server_route';
import { ServerConfig } from '../interfaces/server_config';

export const parseRequestHandler = (input: {
    pathName: string,
    routeConfig: ServerRoute,
    serverConfig: ServerConfig,
}) => {
    return async (req: Request, res: Response) => {
        let errorMessage = '';

        const { pathName, routeConfig, serverConfig } = input;
        const response: {
            statusCode: number, 
            [addtionalField: string]: object | string | number | Buffer | null | undefined | void | boolean
        } = {
            statusCode: 500,
        };

        const serviceInput = routeConfig.prepareInput(req);
        const result = await routeConfig.serviceHandler(serviceInput).catch(err => {
            errorMessage = err.message.toString();
        });

        const errorFieldName = (
            serverConfig.remoting && 
            serverConfig.remoting.rest &&
            serverConfig.remoting.rest.errorHandler &&
            serverConfig.remoting.rest.errorHandler.fieldName
        ) || 'error';

        const successFieldName = (
            serverConfig.remoting && 
            serverConfig.remoting.rest &&
            serverConfig.remoting.rest.successHandler &&
            serverConfig.remoting.rest.successHandler.fieldName
        ) || 'data';

        if (errorMessage) {
            response.statusCode = 500;
            response[errorFieldName] = errorMessage;
            if (Ramda.path(
                ['remoting', 'rest', 'errorHandler', 'writeLog'], 
                serverConfig
            )) {
                Logger.error(`API Error: ${pathName} `);
                Logger.error(`Message: ${errorMessage} `);
            }
        } else {
            if (Ramda.path(
                    ['remoting', 'rest', 'convertNullToError'], 
                    serverConfig
                ) && !result
            ) {
                response.statusCode = 400;
                response[errorFieldName] = 'Data cannot be found';
            } else {
                response.statusCode = 200;
                response[successFieldName] = result;
            }
            if (Ramda.path(
                ['remoting', 'rest', 'successHandler', 'writeLog'], 
                serverConfig
            )) {
                Logger.info(`API Success: ${pathName} `);
                Logger.info(`Result: ${JSON.stringify(result)} `);
            }
        }
        return res.json(response);
    };
};
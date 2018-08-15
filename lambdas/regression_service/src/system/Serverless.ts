import { DatabaseEngines } from './DatabaseEngines';
DatabaseEngines.initialize();
import { ServiceGateway } from './ServiceGateway';
ServiceGateway.initialize();

import { HandlerHelper } from '../scripts/helper/HandlerHelper';
import { LinearRegressionController } from '../application/controllers/LinearRegressionController';

export class Serverless {
    static getRouters() {
        let routers = {
            ...LinearRegressionController.getAsHandler(),
        }
        for (let ctName in routers) {
            routers[ctName] = this.handleEventRequest(routers[ctName])
        }
        return routers;
    }

    static handleEventRequest(controller: (req) => Promise<any>) {
        return async (event, context, callback) => {
            /* Use context to write system-level logs here
            ... ...
            */
            let result, response, error;
            let isError = false;
            try {
                /* Firstly ensure types & body parsing */
                let req = {
                    body: event.body ? JSON.parse(event.body) : {},
                    query: event.queryStringParameters ? event.queryStringParameters: {},
                    params: event.pathParameters ? event.pathParameters : {},
                }
                /* Middleware checking goes here ...
                ... ... ...
                End of middle ware checking */
                result = await controller(req);
                /* After running the service, wrapper the result into
                Appropriate response JSON */
                response = HandlerHelper.createSuccessResponse(200, result);
            }
            catch(err) {
                error = err;
                isError = true;
            }
            if (!isError)
                callback(null, response);
            else
                callback(error);
        }
    }
}
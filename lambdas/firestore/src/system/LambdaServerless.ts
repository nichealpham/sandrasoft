import { HandlerHelper } from '../libs/helper/HandlerHelper';
import { App } from '../app';

export class LambdaServerless {
    static getHandlers() {
        let handlers = App.getAllHandlers();
        for (let hlName in handlers) {
            handlers[hlName] = this.convert2LambdaHandler(handlers[hlName]);
        }
        return handlers;
    }

    static convert2LambdaHandler(controller: (req) => Promise<any>) {
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
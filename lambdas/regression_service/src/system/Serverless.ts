import { ServiceLoader } from './ServiceLoader';
ServiceLoader.startServices();

import { HandlerHelper } from '../scripts/helper/HandlerHelper';
import { LinearRegressionController } from '../application/controllers/LinearRegressionController';

export class Serverless {
    static getRouters() {
        let routers = {
            ...LinearRegressionController.getAsRouter(),
        }
        for (let ctName in routers) {
            routers[ctName] = this.handleEventRequest(routers[ctName])
        }
        return routers;
    }

    static handleEventRequest(controller: (req) => Promise<any>) {
        return async (event, context, callback) => {
            /* Firstly ensure types & body parsing */
            event.body = event.body ? JSON.parse(event.body) : {};
            /* Middleware checking goes here ...
            ... ... ...
            End of middle ware checking */
            let result = await controller(event);
            /* After running the service, wrapper the result into
            Appropriate response JSON */
            let response = HandlerHelper.createSuccessResponse(200, result);
            callback(null, response);
        }
    }
}
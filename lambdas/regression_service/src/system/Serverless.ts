import { ServiceLoader } from './ServiceLoader';
ServiceLoader.init();

import { HandlerHelper } from '../scripts/helper/HandlerHelper';
import { LinearRegressionController } from '../application/controllers/LinearRegressionController';

export class Serverless {
    static getRoutes() {
        let routers = {
            ...LinearRegressionController.getAsRouter(),
        }
        // for (let rtName in routers) {
        //     let router = routers[rtName];
        //     for (let ctName in router) {
        //         routers[rtName][ctName] = this.handleEventRequest(routers[rtName][ctName])
        //     }
        // };
        for (let ctName in routers) {
            routers[ctName] = this.handleEventRequest(routers[ctName])
        }
        return routers;
    }

    static handleEventRequest(controller: (req) => Promise<any>) {
        return async (event, context, callback) => {
            event.body = event.body ? JSON.parse(event.body) : {};
            let result = await controller(event);
            let response = HandlerHelper.createSuccessResponse(200, result);
            callback(null, response);
        }
    }
}
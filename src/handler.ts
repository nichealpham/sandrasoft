import {Greeting} from './app/services/GreetingService';
import {RegressorService} from './app/services/RegressorService';

import {HandlerHelper} from './app/libs/helper/HandlerHelper';

export async function hello (event, context, callback) {
    let greeting = new Greeting('Welcome to ezTensorflow Service !!!');
    let response = HandlerHelper.createSuccessResponse(200, null, greeting.message);
    callback(null, response);
};

export async function trainLinearModelFromCSV (event, context, callback) {
    let response;
    if (!event || !event.body || !event.body.file_url) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain file_url!');
        callback(null, response);
        return;
    }
    if (!event.body.file_url.contain('.csv')) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain url to a CSV file!');
        callback(null, response);
        return;
    }
    let result = await RegressorService.LinearModel.trainFromCSV(event.body.file_url, event.body.config);
    response = HandlerHelper.createSuccessResponse(200, result);
    callback(null, response);
};

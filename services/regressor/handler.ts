import {LinearRegressorService} from './src/script/tfjs-ml/LinearRegressor';
import {HandlerHelper} from './src/script/helper/HandlerHelper';

export async function trainLinearModelFromCSV (event, context, callback) {
    let response;
    let body = !event.body ? {} : JSON.parse(event.body);
    if (!body || !body.file_url) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain file_url!');
        callback(null, response);
        return;
    }
    if (!body.file_url.contain('.csv')) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain url to a CSV file!');
        callback(null, response);
        return;
    }
    if (!body.file_url.contain('https')) {
        response = HandlerHelper.createErrorResponse(400, 'Only accept https origin!');
        callback(null, response);
        return;
    }
    let result = await LinearRegressorService.trainFromCSV(body.file_url, body.config);
    response = HandlerHelper.createSuccessResponse(200, result);
    // response = HandlerHelper.createSuccessResponse(200, body);
    callback(null, response);
};

import {LinearRegressorService} from './src/script/tfjs-ml/LinearRegressor';
import {HandlerHelper} from './src/script/helper/HandlerHelper';

export async function trainLinearModelFromCSV (event, context, callback) {
    let response, result;
    if (!event.headers || !event.headers['API_KEY']) {
        response = HandlerHelper.createErrorResponse(400, 'API KEY is missing !');
        callback(null, response);
        return;
    }
    let body = JSON.parse(event.body);
    if (!body || !body.file_url) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain file_url!');
        callback(null, response);
        return;
    }
    if (!body.file_url.includes('.csv')) {
        response = HandlerHelper.createErrorResponse(400, 'Request must contain url to a CSV file!');
        callback(null, response);
        return;
    }
    if (!body.file_url.includes('https')) {
        response = HandlerHelper.createErrorResponse(400, 'Only accept https origin!');
        callback(null, response);
        return;
    }
    try {
        let apiKey = event.headers['API_KEY'];
        let option = {
            config: body.config,
            fileUrl: body.file_url,
        };
        result = await LinearRegressorService.trainFromCSV(apiKey, option);
        response = HandlerHelper.createSuccessResponse(200, result, 'Model create and training completed !');
    }
    catch (err) {
        response = HandlerHelper.createErrorResponse(400, err);
    }
    callback(null, response);
};
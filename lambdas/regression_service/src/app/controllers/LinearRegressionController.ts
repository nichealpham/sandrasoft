import {LinearRegressionService} from '../views/LinearRegressionService';
import {HandlerHelper} from '../models/helper/HandlerHelper';

export class LinearRegressionController {
    static trainModel = {
        routing: '/regression/linear/train-model',
        method: 'POST',
        mainFunc: async (event, context, callback) => {
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
                // let apiKey = event.headers['API_KEY'];
                let input = {
                    fileUrl: body.file_url,
                    config: body.config,
                };
                let result = await LinearRegressionService.trainModelFromCsv(input);
                response = HandlerHelper.createSuccessResponse(200, result, 'Model create and training completed !');
            }
            catch (err) {
                response = HandlerHelper.createErrorResponse(400, err);
            }
            callback(null, response);
        }
    }
}
import {ServiceLoader} from '../../system/ServiceLoader';
import {HandlerHelper} from '../../scripts/helper/HandlerHelper';

export class LinearRegressionController {
    static createModel = {
        routing: '/regression/linear/create-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            event.body = JSON.parse(event.body);
            let result = await ServiceLoader.LinearRegressionService.createMonica(event.body.data);
            let response = HandlerHelper.createSuccessResponse(200, result, 'Model create successful !');
            callback(null, response);
        }
    };

    static trainModel = {
        routing: '/regression/linear/train-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            event.body = JSON.parse(event.body);
            let input = {
                fileUrl: event.body.file_url,
                config: event.body.config,
            };
            let result = await ServiceLoader.LinearRegressionService.trainMonicaFromCsv(input);
            let response = HandlerHelper.createSuccessResponse(200, result, 'Model create and training completed !');
            callback(null, response);
        }
    }
}
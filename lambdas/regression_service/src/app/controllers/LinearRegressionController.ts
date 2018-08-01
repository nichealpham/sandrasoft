import {LinearRegressionService} from '../views/LinearRegressionService';
import {HandlerHelper} from '../models/helper/HandlerHelper';
import {Middleware} from '../../system/Middleware';

export class LinearRegressionController {
    static createModel = {
        routing: '/regression/linear/create-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            let params = {
                headers: ['API_KEY'],
                body: ['data'],
            }
            let {status, response} = Middleware.ensureExist(event, params);
            if (!status) {
                callback(null, response);
                return;
            }
            let result = await LinearRegressionService.createMonica(event.body.data);
            response = HandlerHelper.createSuccessResponse(200, result, 'Model create successful !');
            callback(null, response);
        }
    };

    static trainModel = {
        routing: '/regression/linear/train-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            let params = {
                headers: ['API_KEY'],
                body: ['file_url', 'config']
            }
            let {status, response} = Middleware.ensureExist(event, params);
            if (!status) {
                callback(null, response);
                return;
            }
            let input = {
                fileUrl: event.body.file_url,
                config: event.body.config,
            };
            let result = await LinearRegressionService.trainMonicaFromCsv(input);
            response = HandlerHelper.createSuccessResponse(200, result, 'Model create and training completed !');
            callback(null, response);
        }
    }
}
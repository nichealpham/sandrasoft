import {LinearRegressionService} from '../views/LinearRegressionService';
import {HandlerHelper} from '../models/helper/HandlerHelper';
import {ValidatorHelper} from '../models/helper/ValidatorHelper';

export class LinearRegressionController {
    static createModel = {
        routing: '/regression/linear/create-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            let param = {
                headers: ['API_KEY'],
                body: ['data'],
            }
            let {status, response} = ValidatorHelper.ensureExist(event, param);
            if (!status) {
                callback(null, response);
                return;
            }

            let body = JSON.parse(event.body);
            let result = await LinearRegressionService.createMonica(body.data);
            response = HandlerHelper.createSuccessResponse(200, result, 'Model create successful !');
            callback(null, response);
        }
    };

    static trainModel = {
        routing: '/regression/linear/train-model',
        method: 'POST',
        mainfunc: async (event, context, callback) => {
            // let param = {
            //     headers: ['API_KEY'],
            //     body: ['file_url', 'config']
            // }
            // let {status, response} = ValidatorHelper.ensureExist(event, param);
            // if (!status) {
            //     callback(null, response);
            //     return;
            // }

            let body = JSON.parse(event.body);
            let input = {
                fileUrl: body.file_url,
                config: body.config,
            };
            let result = await LinearRegressionService.trainMonicaFromCsv(input);
            let response = HandlerHelper.createSuccessResponse(200, result, 'Model create and training completed !');
            callback(null, response);
        }
    }
}
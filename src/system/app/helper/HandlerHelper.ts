import {ErrorCommon} from '../model/error/ErrorCommon';

export class HandlerHelper {
    static handleRequestPromise(promise): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            promise.then(({data, error}) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            }).catch(error => {
                reject(new ErrorCommon(10));
            });
        });
    }

    static createSuccessResponse(code = 200, data?: any, message: String = 'Success') {
        let body: any = {
            message
        };
        if (data) body.data = data;
        return {
            statusCode: code,
            body: JSON.stringify(body),
        };
    }

    static createErrorResponse(code = 400, message: String = 'An error occured during the process!') {
        return {
            statusCode: code,
            error: message
        }
    }
}
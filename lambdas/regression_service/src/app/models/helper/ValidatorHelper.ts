import {HandlerHelper} from './HandlerHelper';

export class ValidatorHelper {
    static ensureExist(event, params): {status: boolean, response} {
        if (!event) {
            return {
                status: false,
                response: HandlerHelper.createErrorResponse(400, 'REQUEST cannot be null !')
            }
        }
        for (let key in params) {
            if (!event[key]) {
                return {
                    status: false,
                    response: HandlerHelper.createErrorResponse(400, `${key.toUpperCase()} is missing in REQUEST !`)
                }
            }
            for (let i = 0; i < params[key].length; i++) {
                if (!event[key][params[key][i]]) {
                    return {
                        status: false,
                        response: HandlerHelper.createErrorResponse(400, `${params[key][i].toUpperCase()} is missing in ${key.toUpperCase()} !`)
                    }
                }
            }
        }
        return {
            status: true,
            response: 'Validation successful !'
        }
    };
}
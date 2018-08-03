export class HandlerHelper {
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
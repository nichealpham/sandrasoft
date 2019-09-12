"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger");
exports.parseRequestHandler = (input) => {
    return async (req, res) => {
        let errorMessage = '';
        const { pathName, routeConfig } = input;
        const response = {
            statusCode: 500,
        };
        const result = await routeConfig.controller(req).catch(err => {
            errorMessage = err.message;
        });
        const errorFieldName = 'error';
        const successFieldName = 'data';
        if (errorMessage) {
            response.statusCode = 500;
            response[errorFieldName] = errorMessage;
            logger_1.Logger.error(`API Error: ${pathName} `);
            logger_1.Logger.debug(`Message: ${errorMessage} `);
        }
        else {
            if (!result) {
                response.statusCode = 400;
                response[errorFieldName] = 'Data cannot be found';
            }
            else {
                response.statusCode = 200;
                response[successFieldName] = result;
            }
            logger_1.Logger.info(`API Success: ${pathName} `);
            logger_1.Logger.debug(`Result: ${JSON.stringify(result)} `);
        }
        return res.json(response);
    };
};
//# sourceMappingURL=ParseRequestHandler.js.map
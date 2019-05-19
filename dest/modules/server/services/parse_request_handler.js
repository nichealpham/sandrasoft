"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ramda = require("ramda");
const logger_1 = require("../../logger");
exports.parseRequestHandler = (input) => {
    return async (req, res) => {
        let errorMessage = '';
        const { pathName, routeConfig, serverConfig } = input;
        const response = {
            statusCode: 500,
        };
        const serviceInput = routeConfig.prepareInput(req);
        const result = await routeConfig.serviceHandler(serviceInput).catch(err => {
            errorMessage = err.message.toString();
        });
        const errorFieldName = (serverConfig.remoting &&
            serverConfig.remoting.rest &&
            serverConfig.remoting.rest.errorHandler &&
            serverConfig.remoting.rest.errorHandler.fieldName) || 'error';
        const successFieldName = (serverConfig.remoting &&
            serverConfig.remoting.rest &&
            serverConfig.remoting.rest.successHandler &&
            serverConfig.remoting.rest.successHandler.fieldName) || 'data';
        if (errorMessage) {
            response.statusCode = 500;
            response[errorFieldName] = errorMessage;
            if (Ramda.path(['remoting', 'rest', 'errorHandler', 'writeLog'], serverConfig)) {
                logger_1.Logger.error(`API Error: ${pathName} `);
                logger_1.Logger.error(`Message: ${errorMessage} `);
            }
        }
        else {
            if (Ramda.path(['remoting', 'rest', 'convertNullToError'], serverConfig) && !result) {
                response.statusCode = 400;
                response[errorFieldName] = 'Data cannot be found';
            }
            else {
                response.statusCode = 200;
                response[successFieldName] = result;
            }
            if (Ramda.path(['remoting', 'rest', 'successHandler', 'writeLog'], serverConfig)) {
                logger_1.Logger.info(`API Success: ${pathName} `);
                logger_1.Logger.info(`Result: ${JSON.stringify(result)} `);
            }
        }
        return res.json(response);
    };
};
//# sourceMappingURL=parse_request_handler.js.map
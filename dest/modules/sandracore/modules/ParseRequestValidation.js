"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const ramda = require("ramda");
const logger_1 = require("../../logger");
exports.parseRequestValidations = (validations = {}) => {
    return (req, res, next) => {
        const request = ramda.mergeDeepRight(JSON.parse(JSON.stringify(validations)), {
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params,
        });
        const schema = ramda.mergeDeepWith(exports.validateMergeValue, request, validations);
        if (JSON.stringify(schema).includes(':false')) {
            res.json({
                statusCode: 422,
                error: 'Invalid params',
            });
        }
        else {
            next();
        }
    };
};
exports.validateMergeValue = (value, methods) => {
    for (let method of methods) {
        try {
            let opposite = false;
            if (method.includes('!')) {
                method = method.replace('!', '');
                opposite = true;
            }
            const output = validator[method](value);
            if (opposite) {
                if (output) {
                    return false;
                }
            }
            else {
                if (!output) {
                    return false;
                }
            }
        }
        catch (err) {
            logger_1.Logger.error(`validateMergeValue error: ${err.message}`);
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=ParseRequestValidation.js.map
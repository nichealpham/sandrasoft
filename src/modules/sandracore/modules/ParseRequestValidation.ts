import * as validator from 'validator';
import * as ramda from 'ramda';
import { Request, Response, NextFunction } from "express";
import { ServerValidations } from "../interfaces/ServerValidations";
import { Logger } from '../../logger';

export const parseRequestValidations = (validations: ServerValidations = {}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const request = ramda.mergeDeepRight(
            JSON.parse(JSON.stringify(validations)),
            {
                headers: req.headers,
                body: req.body,
                query: req.query,
                params: req.params,
            }
        );
        const schema = ramda.mergeDeepWith(
            validateMergeValue,
            request,
            validations
        );
        if (JSON.stringify(schema).includes(':false')) {
            res.json({
                statusCode: 422,
                error: 'Invalid params',
            });
        } else {
            next();
        }
    };
};

export const validateMergeValue = (value, methods: string[]): boolean => {
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
            } else {
                if (!output) {
                    return false;
                }
            }
        } catch (err) {
            Logger.error(`validateMergeValue error: ${err.message}`);
            return false;
        }
    }
    return true;
};
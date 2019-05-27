"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ramda = require("ramda");
const RequestPromise = require("request-promise");
const logger_1 = require("../logger");
const helper_1 = require("../helper");
const defaultRequestInput = {
    url: '',
    query: {},
    headers: {},
    config: {},
};
const defaultRequestConfig = {
    timeout: 12000,
};
class Request {
    static async get(input) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = Object.assign({ method: 'GET', uri: input.url, json: true, qs: input.query, headers: input.headers }, input.config);
        const result = await callRequest(options);
        return result;
    }
    static async post(input, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = Object.assign({ method: 'POST', uri: input.url, json: true, qs: input.query, headers: input.headers }, input.config, { body: data });
        const result = await callRequest(options);
        return result;
    }
    static async put(input, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = Object.assign({ method: 'PUT', uri: input.url, json: true, qs: input.query, headers: input.headers }, input.config, { body: data });
        const result = await callRequest(options);
        return result;
    }
    static async delete(input) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = Object.assign({ method: 'DELETE', uri: input.url, json: true, qs: input.query, headers: input.headers }, input.config);
        const result = await callRequest(options);
        return result;
    }
    static async postFile(input, filePath, uploadKey, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        if (!helper_1.SystemHelper.dirExist(filePath)) {
            throw new Error(`Request post file not exist!`);
        }
        const options = Object.assign({ method: 'POST', uri: input.url, json: true, qs: input.query, headers: input.headers }, input.config, { formData: data });
        options.formData[uploadKey] = fs.createReadStream(filePath);
        const result = await callRequest(options);
        return result;
    }
}
exports.Request = Request;
const callRequest = (options) => {
    return new Promise((resolve, reject) => {
        RequestPromise(options).then(data => {
            return resolve(data);
        }).catch(error => {
            logger_1.Logger.error(`Request Error! ${options.method} url: ${options.uri}`);
            logger_1.Logger.warn(`Error message: ${error.message.toString()}`);
            return reject(error);
        });
    });
};
//# sourceMappingURL=index.js.map
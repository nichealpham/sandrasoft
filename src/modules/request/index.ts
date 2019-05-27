// Import external-modules
import * as fs from 'fs';
import * as ramda from 'ramda';
import * as RequestPromise from 'request-promise';

// Import peer-modules
import { Logger } from '../logger';
import { SystemHelper } from '../helper';

// Import sub-modules
import { RequestInput } from './interface/request_input';

const defaultRequestInput = {
    url: '',
    query: {},
    headers: {},
    config: {},
};
const defaultRequestConfig = {
    timeout: 12000,
};

export class Request {
    static async get(input: RequestInput) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = {
            method: 'GET',
            uri: input.url,
            json: true,
            qs: input.query,
            headers: input.headers,
            ...input.config,
        };
        const result = await callRequest(options);
        return result;
    }

    static async post(input: RequestInput, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = {
            method: 'POST',
            uri: input.url,
            json: true,
            qs: input.query,
            headers: input.headers,
            ...input.config,
            body: data,
        };
        const result = await callRequest(options);
        return result;
    }

    static async put(input: RequestInput, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = {
            method: 'PUT',
            uri: input.url,
            json: true,
            qs: input.query,
            headers: input.headers,
            ...input.config,
            body: data,
        };
        const result = await callRequest(options);
        return result;
    }

    static async delete(input: RequestInput) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        const options = {
            method: 'DELETE',
            uri: input.url,
            json: true,
            qs: input.query,
            headers: input.headers,
            ...input.config,
        };
        const result = await callRequest(options);
        return result;
    }

    static async postFile(input: RequestInput, filePath: string, uploadKey: string, data = {}) {
        input = ramda.mergeRight(defaultRequestInput, input);
        input.config = ramda.mergeDeepRight(defaultRequestConfig, input.config || {});
        if (!input.url || ramda.isEmpty(input.url)) {
            throw new Error(`Request url is invalid`);
        }
        if (!SystemHelper.dirExist(filePath)) {
            throw new Error(`Request post file not exist!`);
        }
        const options = {
            method: 'POST',
            uri: input.url,
            json: true,
            qs: input.query,
            headers: input.headers,
            ...input.config,
            formData: data,
        };
        options.formData[uploadKey] = fs.createReadStream(filePath);
        const result = await callRequest(options);
        return result;
    }
}

const callRequest = (options: RequestPromise.OptionsWithUri) => {
    return new Promise((resolve, reject) => {
        RequestPromise(options).then(data => {
            return resolve(data);
        }).catch(error => {
            Logger.error(`Request Error! ${options.method} url: ${options.uri}`);
            Logger.warn(`Error message: ${error.message.toString()}`);
            return reject(error);
        });
    });
};
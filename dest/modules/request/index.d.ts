import * as RequestPromise from 'request-promise';
import { RequestInput } from './interface/request_input';
export declare class Request {
    static get(input: RequestInput): Promise<unknown>;
    static post(input: RequestInput, data?: {}): Promise<unknown>;
    static put(input: RequestInput, data?: {}): Promise<unknown>;
    static delete(input: RequestInput): Promise<unknown>;
    static postFile(input: RequestInput, filePath: string, uploadKey: string, data?: {}): Promise<unknown>;
}
export declare const callRequest: (options: RequestPromise.OptionsWithUri) => Promise<unknown>;
export declare const buildQueryString: (query?: {}) => string;

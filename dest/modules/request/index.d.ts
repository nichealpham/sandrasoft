import * as RequestPromise from 'request-promise';
import { RequestInput } from './interface/request_input';
export declare class Request {
    static get(input: RequestInput): Promise<{}>;
    static post(input: RequestInput, data?: {}): Promise<{}>;
    static put(input: RequestInput, data?: {}): Promise<{}>;
    static delete(input: RequestInput): Promise<{}>;
    static postFile(input: RequestInput, filePath: string, uploadKey: string, data?: {}): Promise<{}>;
}
export declare const callRequest: (options: RequestPromise.OptionsWithUri) => Promise<{}>;
export declare const buildQueryString: (query?: {}) => string;

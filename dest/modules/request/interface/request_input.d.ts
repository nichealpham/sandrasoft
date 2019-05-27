import { RequestConfig } from "./request_config";
export interface RequestInput {
    url: string;
    query?: object;
    headers?: object;
    config?: RequestConfig;
}

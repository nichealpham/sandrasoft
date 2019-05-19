export interface ServerValidations {
    headers?: {
        [headerField: string]: string[];
    };
    params?: {
        [paramsField: string]: string[];
    };
    query?: {
        [queryField: string]: string[];
    };
    body?: {
        [bodyField: string]: string[];
    };
}

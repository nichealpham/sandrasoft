export interface ServerValidations {
    headers?: ValidationItem;
    params?: ValidationItem;
    query?: ValidationItem;
    body?: ValidationItem;
}

interface ValidationItem {
    [headerField: string]: string[] | ValidationItem;
}
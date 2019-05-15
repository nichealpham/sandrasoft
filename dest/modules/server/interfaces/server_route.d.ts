export interface ServerRoute {
    method: string;
    url: string;
    validators?: Function[];
    params?: {
        [paramName: string]: string;
    };
    controller: Function;
}

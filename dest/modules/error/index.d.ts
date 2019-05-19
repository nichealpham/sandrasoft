/// <reference types="node" />
export declare const errorServerCreate: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const errorServerApplyMiddlewares: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const errorServerApplyMiddleware: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const errorServerApplyRoutes: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const errorServerApplyRoute: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const errorServerStartListenning: {
    new (detailMsg?: string | undefined): {
        errorCode: number;
        errorName: string;
        message: string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};

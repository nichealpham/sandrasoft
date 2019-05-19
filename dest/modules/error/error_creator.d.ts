/// <reference types="node" />
export declare class ErrorCreator {
    static createCustomError: (config: {
        errorCode: number;
        errorName: string;
    }) => {
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
}

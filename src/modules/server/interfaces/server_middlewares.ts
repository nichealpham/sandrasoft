import { MiddlewareFunction } from "./middleware_function";

export interface ServerMiddlewares {
    [middwareName: string]: MiddlewareFunction;
}
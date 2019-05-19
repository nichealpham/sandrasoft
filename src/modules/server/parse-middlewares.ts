import { ServerMiddlewares } from "./interfaces/server_middlewares";
import { MiddlewareFunction } from "./interfaces/middleware_function";
import * as Ramda from 'ramda';

export const parseMiddlewares = (middlewares: ServerMiddlewares = {}): MiddlewareFunction[] => {
    if (Ramda.isEmpty(middlewares)) {
        return [];
    }
    const result: MiddlewareFunction[] = [];
    for (const middlewareName of Object.keys(middlewares)) {
        result.push(middlewares[middlewareName]);
    }
    return result;
};
import { ServerMiddlewares } from "./interfaces/server_middlewares";
import { MiddlewareFunction } from "./interfaces/middleware_function";
export declare const parseMiddlewares: (middlewares?: ServerMiddlewares) => MiddlewareFunction[];

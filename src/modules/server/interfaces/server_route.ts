import { Request } from "express";
import { ServerMiddlewares } from "./server_middlewares";
import { ServerValidations } from "./server_validations";

export interface ServerRoute {
    method: string;
    paths: string[];
    middlewares?: ServerMiddlewares;
    validations?: ServerValidations;
    prepareInput: (req: Request) => object;
    serviceHandler: (input: object) => object | string | number | Buffer;
}


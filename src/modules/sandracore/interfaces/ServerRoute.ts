import { Request } from "express";
import { ServerValidations } from "./ServerValidations";
import { MiddlewareFunction } from "./MiddlewareFunction";

export interface ServerRoute {
    method: string;
    paths: string[];
    middlewares?: MiddlewareFunction[];
    validations?: ServerValidations;
    controller: (req: Request) => Promise<object | string | number | Buffer | null | undefined | boolean>;
}


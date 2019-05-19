import { Request, Response, NextFunction } from "express";

export interface MiddlewareFunction {
    (req: Request, res: Response, next: NextFunction): void;
}
import { Request, Response, NextFunction } from "express";
import { ServerValidations } from "../interfaces/server_validations";
export declare const parseRequestValidations: (validations?: ServerValidations) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateMergeValue: (value: any, methods: string[]) => boolean;

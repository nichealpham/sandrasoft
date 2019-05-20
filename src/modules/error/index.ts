import { ErrorCreator } from "./error_creator";

export const errorInvalidParamaters = ErrorCreator.createCustomError({
    errorName: 'Invalid params',
    errorCode: 422,
});
export const errorServerCreate = ErrorCreator.createCustomError({
    errorName: 'Create server',
    errorCode: 1000,
});
export const errorServerApplyMiddlewares = ErrorCreator.createCustomError({
    errorName: 'Apply middlewares',
    errorCode: 1100,
});
export const errorServerApplyMiddleware = ErrorCreator.createCustomError({
    errorName: 'Apply middleware',
    errorCode: 1110,
});
export const errorServerApplyRoutes = ErrorCreator.createCustomError({
    errorName: 'Apply routes',
    errorCode: 1200,
});
export const errorServerApplyRoute = ErrorCreator.createCustomError({
    errorName: 'Apply route',
    errorCode: 1210,
});
export const errorServerStartListenning = ErrorCreator.createCustomError({
    errorName: 'Start server',
    errorCode: 1300,
});
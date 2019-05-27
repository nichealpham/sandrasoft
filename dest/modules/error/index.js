"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_creator_1 = require("./error_creator");
exports.errorInvalidParamaters = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Invalid params',
    errorCode: 422,
});
exports.errorServerCreate = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Create server',
    errorCode: 1000,
});
exports.errorServerApplyMiddlewares = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Apply middlewares',
    errorCode: 1100,
});
exports.errorServerApplyMiddleware = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Apply middleware',
    errorCode: 1110,
});
exports.errorServerApplyRoutes = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Apply routes',
    errorCode: 1200,
});
exports.errorServerApplyRoute = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Apply route',
    errorCode: 1210,
});
exports.errorServerStartListenning = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Start server',
    errorCode: 1300,
});
exports.errorTerminalExecute = error_creator_1.ErrorCreator.createCustomError({
    errorName: 'Terminal execute',
    errorCode: 9000,
});
//# sourceMappingURL=index.js.map
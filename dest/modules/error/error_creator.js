"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorCreator {
}
ErrorCreator.createCustomError = (config) => {
    const { errorCode, errorName } = config;
    return class CustomError extends Error {
        constructor(detailMsg) {
            super('Oops! Something wrong happened.');
            this.errorCode = errorCode;
            this.errorName = errorName;
            if (detailMsg) {
                this.message += ` ${this.errorName} error: ${detailMsg}`;
            }
        }
    };
};
exports.ErrorCreator = ErrorCreator;
//# sourceMappingURL=error_creator.js.map
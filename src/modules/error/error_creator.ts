export class ErrorCreator {
    static createCustomError = (config: {
        errorCode: number,
        errorName: string,
    }) => {
        const { errorCode, errorName } = config;

        return class CustomError extends Error {
            errorCode: number = errorCode;
            errorName: string = errorName;
            message: string;
        
            constructor(detailMsg?: string) {
                super('Oops! Something wrong happened.');
                if (detailMsg) {
                    this.message = `${this.errorName} error: ${detailMsg}`;
                }
            }
        };
    }
}
export const parseServiceHandler = () => {
    return async (req: Request, res: Response) => {
        const params: {[key: string]: object | string | number} = {};
        const paramsConfig = routeConfig.params || {};

        for (const paramName of Object.keys(paramsConfig)) {
            const steps = paramsConfig[paramName].split('.');
            let value = req;
            for (let i = 1; i < steps.length; i++) {
                value = value[steps[i]];
            }
            params[paramName] = value;
        }
        let errorMessage = '';
        let response: {
            statusCode: number, 
            [addtionalField: string]: object | string | number
        } = {
            statusCode: 500,
        };
        const result = await routeConfig.controller(params).catch((err: Error) => {
            errorMessage = err.toString();
        });
        if (errorMessage) {
            if (this.serverConfig.remoting &&
                this.serverConfig.remoting.rest &&
                this.serverConfig.remoting.rest.errorHandler &&
                this.serverConfig.remoting.rest.errorHandler.fieldName
            ) {
                response.statusCode = 500;
                response[this.serverConfig.remoting.rest.errorHandler.fieldName] = errorMessage;
            }
            else {
                response = {
                    statusCode: 500,
                    message: 'Internal Server Error',
                };
            }
            if (this.serverConfig.remoting &&
                this.serverConfig.remoting.rest &&
                this.serverConfig.remoting.rest.errorHandler &&
                this.serverConfig.remoting.rest.errorHandler.writeLog
            ) {
                Logger.error(`API Error: ${pathName} `);
                Logger.error(`Message: ${errorMessage} `);
            }
        }
        else {
            if (!result && 
                this.serverConfig.remoting &&
                this.serverConfig.remoting.rest &&
                this.serverConfig.remoting.rest.convertNullToError
            ) {
                response = {
                    statusCode: 400,
                    message: 'Data cannot be found',
                };
            }
            else {
                if (this.serverConfig.remoting &&
                    this.serverConfig.remoting.rest &&
                    this.serverConfig.remoting.rest.successHandler &&
                    this.serverConfig.remoting.rest.successHandler.fieldName
                ) {
                    response.statusCode = 200;
                    response[this.serverConfig.remoting.rest.successHandler.fieldName] = result;
                }
                else {
                    response = {
                        statusCode: 200,
                        data: result,
                    };
                }
            }
            if (this.serverConfig.remoting &&
                this.serverConfig.remoting.rest &&
                this.serverConfig.remoting.rest.successHandler &&
                this.serverConfig.remoting.rest.successHandler.writeLog
            ) {
                Logger.info(`API Success: ${routeName} `);
                Logger.info(`Result: ${JSON.stringify(result)} `);
            }
        }
        return res.json(response);
    }
}
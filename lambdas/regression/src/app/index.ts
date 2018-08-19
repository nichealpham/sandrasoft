import { LinearRegressionController } from './controllers/LinearRegressionController';

export class App {
    static getAllRouters() {
        return {
            ...LinearRegressionController.getAsRounter()
        }
    }

    static getAllHandlers() {
        return {
            ...LinearRegressionController.getAsHandler()
        }
    }
}
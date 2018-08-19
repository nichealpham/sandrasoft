import { ModelController } from './controllers/ModelController';

export class App {
    static getAllRouters() {
        return {
            ...ModelController.getAsRounter()
        }
    }

    static getAllHandlers() {
        return {
            ...ModelController.getAsHandler()
        }
    }
}
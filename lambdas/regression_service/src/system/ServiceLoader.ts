import {LinearRegressionService} from '../application/views/LinearRegressionService';

export class ServiceLoader {
    static LinearRegressionService: LinearRegressionService;
    
    static startServices() {
        this.LinearRegressionService = new LinearRegressionService();
    }
}
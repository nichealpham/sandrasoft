import {LinearRegressionService} from '../application/views/LinearRegressionService';

export class ServiceLoader {
    static LinearRegressionService: LinearRegressionService;
    
    static init() {
        this.LinearRegressionService = new LinearRegressionService();
    }
}
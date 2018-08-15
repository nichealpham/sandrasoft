import { LinearRegressionService } from '../application/views/LinearRegressionService';

export class ServiceGateway {
    static LinearRegressionService: LinearRegressionService;
    
    static initialize() {
        this.LinearRegressionService = new LinearRegressionService();
    }
}
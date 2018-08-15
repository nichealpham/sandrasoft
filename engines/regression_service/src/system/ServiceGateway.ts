import { ConsoleColor } from '../application/models/common/ConsoleColor';
import { LinearRegressionService } from '../application/views/LinearRegressionService';

export class ServiceGateway {
    static LinearRegressionService: LinearRegressionService;
    
    static initialize() {
        this.LinearRegressionService = new LinearRegressionService();

	    console.log(ConsoleColor.Green, '\n 3. Services Gateway Initilize Success');
    }
}
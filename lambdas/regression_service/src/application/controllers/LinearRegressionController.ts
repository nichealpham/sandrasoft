import { ServiceLoader } from '../../system/ServiceLoader';
import { Monica } from '../models/monica/Monica';

export class LinearRegressionController {
    static getAsRouter() {
        return {
            trainLinearRegressionModel: this.trainModel,
            createLinearRegressionModel: this.createModel,
        }
    }

    static async createModel(req): Promise<Monica> {
        return await ServiceLoader.LinearRegressionService.createMonica(req.body.data);
    }
    
    static async trainModel(req): Promise<{model}> {
        let input = {
            fileUrl: req.body.file_url,
            config: req.body.config,
        };
        return await ServiceLoader.LinearRegressionService.trainMonicaFromCsv(input);
    }
}


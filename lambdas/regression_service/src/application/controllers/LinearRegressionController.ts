import { ServiceLoader } from '../../system/ServiceLoader';
import { Monica } from '../models/monica/Monica';

export class LinearRegressionController {
    static getAsRouter() {
        return {
            getLinearRegressionModel: this.getModel,
            trainLinearRegressionModel: this.trainModel,
            createLinearRegressionModel: this.createModel,
            deleteLinearRegressionModel: this.deleteModel,
        }
    }

    static async getModel(req): Promise<Monica> {
        return await ServiceLoader.LinearRegressionService.getModel(req.params._id);
    }

    static async createModel(req): Promise<Monica> {
        return await ServiceLoader.LinearRegressionService.createModel(req.body.data);
    }
    
    static async trainModel(req): Promise<{model}> {
        let input = {
            fileUrl: req.body.file_url,
            config: req.body.config,
        };
        return await ServiceLoader.LinearRegressionService.trainModelFromCsv(input);
    }

    static async deleteModel(req): Promise<boolean> {
        return await ServiceLoader.LinearRegressionService.deleteModel(req.params._id);
    }
}


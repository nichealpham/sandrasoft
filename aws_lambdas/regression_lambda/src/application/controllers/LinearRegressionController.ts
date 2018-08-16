import { ServiceLoader } from '../../system/ServiceLoader';
import { Monica } from '../models/monica/Monica';

export class LinearRegressionController {
    static getAsHandler() {
        return {
            getLinearRegressionModel: this.getModel,
            trainLinearRegressionModel: this.trainModel,
            createLinearRegressionModel: this.createModel,
            deleteLinearRegressionModel: this.deleteModel,
        }
    }

    static getAsRounter() {
        return {
            'GET://services/linear-regression/get-model/:_id': this.getModel,
            'POST://services/linear-regression/train-model': this.trainModel,
            'POST://services/linear-regression/create-model': this.createModel,
            'DELETE://services/linear-regression/delete-model/:_id': this.deleteModel,
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
            fileUrl: req.body.fileUrl,
            config: req.body.config,
            modelId: req.body.modelId
        };
        return await ServiceLoader.LinearRegressionService.trainModelFromCsv(input);
    }

    static async deleteModel(req): Promise<boolean> {
        return await ServiceLoader.LinearRegressionService.deleteModel(req.params._id);
    }
}


import { ServiceGateway } from '../../system/ServiceGateway';
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
            'GET://engine/linear-regression/get-model/:_id': this.getModel,
            'POST://engine/linear-regression/train-model/:_id': this.trainModel,
            'POST://engine/linear-regression/create-model': this.createModel,
            'DELETE://engine/linear-regression/delete-model/:_id': this.deleteModel,
        }
    }

    static async getModel(req): Promise<Monica> {
        return await ServiceGateway.LinearRegressionService.getModel(req.params._id);
    }

    static async createModel(req): Promise<Monica> {
        return await ServiceGateway.LinearRegressionService.createModel(req.body.data);
    }
    
    static async trainModel(req): Promise<{model}> {
        let input = {
            fileUrl: req.body.fileUrl,
            config: req.body.config,
            modelId: req.params._id
        };
        return await ServiceGateway.LinearRegressionService.trainModelFromCsv(input);
    }

    static async deleteModel(req): Promise<boolean> {
        return await ServiceGateway.LinearRegressionService.deleteModel(req.params._id);
    }
}


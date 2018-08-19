import { LinearRegressionService } from '../services/LinearRegressionService';

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
            'GET://linear/get-model/:_id': this.getModel,
            'POST://linear/train-model/:_id': this.trainModel,
            'POST://linear/create-model': this.createModel,
            'DELETE://linear/delete-model/:_id': this.deleteModel,
        }
    }

    static async getModel(req) {
        return await LinearRegressionService.getModel(req.params._id);
    }

    static async createModel(req) {
        return await LinearRegressionService.createModel(req.body.data);
    }
    
    static async trainModel(req) {
        let input = {
            fileUrl: req.body.fileUrl,
            config: req.body.config,
            modelId: req.params._id,
        };
        return await LinearRegressionService.trainModelFromCsv(input);
    }

    static async deleteModel(req) {
        return await LinearRegressionService.deleteModel(req.params._id);
    }
}


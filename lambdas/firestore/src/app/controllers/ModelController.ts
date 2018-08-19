import { ModelService } from '../services/ModelService';

export class ModelController {
    static getAsHandler() {
        return {
            getModel: this.getModel,
            createModel: this.createModel,
            updateModel: this.updateModel,
            deleteModel: this.deleteModel,
        }
    }

    static getAsRounter() {
        return {
            'GET://model/get/:_id': this.getModel,
            'POST://model/create': this.createModel,
            'PUT://model/update/:_id': this.updateModel,
            'DELETE://model/delete/:_id': this.deleteModel,
        }
    }

    static async getModel(req) {
        return await ModelService.getModel(req.params._id);
    }

    static async createModel(req) {
        return await ModelService.createModel(req.body.data);
    }
    
    static async updateModel(req) {
        return await ModelService.updateModel(req.params._id, req.body.data);
    }

    static async deleteModel(req) {
        return await ModelService.deleteModel(req.params._id);
    }
}


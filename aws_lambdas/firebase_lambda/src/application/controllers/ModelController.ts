import { ServiceLoader } from '../../system/ServiceLoader';
import { Monica } from '../models/monica/Monica';

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
            'GET://lambda/firebase/monica/get/:_id': this.getModel,
            'POST://lambda/firebase/monica/create': this.createModel,
            'PUT://lambda/firebase/monica/update/:_id': this.updateModel,
            'DELETE://lambda/firebase/monica/delete/:_id': this.deleteModel,
        }
    }

    static async getModel(req): Promise<Monica> {
        return await ServiceLoader.modelService.getModel(req.params._id);
    }

    static async createModel(req): Promise<Monica> {
        return await ServiceLoader.modelService.createModel(req.body.data);
    }
    
    static async updateModel(req): Promise<boolean> {
        return await ServiceLoader.modelService.updateModel(req.params._id, req.body.data);
    }

    static async deleteModel(req): Promise<boolean> {
        return await ServiceLoader.modelService.deleteModel(req.params._id);
    }
}


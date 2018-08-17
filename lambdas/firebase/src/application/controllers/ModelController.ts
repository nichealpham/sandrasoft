import { ServiceGateway } from '../../system/ServiceGateway';
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
            'GET://lambda/firebase/model/get/:_id': this.getModel,
            'POST://lambda/firebase/model/create': this.createModel,
            'PUT://lambda/firebase/model/update/:_id': this.updateModel,
            'DELETE://lambda/firebase/model/delete/:_id': this.deleteModel,
        }
    }

    static async getModel(req): Promise<Monica> {
        return await ServiceGateway.modelService.getModel(req.params._id);
    }

    static async createModel(req): Promise<Monica> {
        return await ServiceGateway.modelService.createModel(req.body.data);
    }
    
    static async updateModel(req): Promise<boolean> {
        return await ServiceGateway.modelService.updateModel(req.params._id, req.body.data);
    }

    static async deleteModel(req): Promise<boolean> {
        return await ServiceGateway.modelService.deleteModel(req.params._id);
    }
}


import { Monica, IMonica } from '../models/monica/Monica';
import { FirestoreRepository } from '../../scripts/firebase/FirestoreRepository';
import { ServiceConfig } from '../../system/Config';

export interface IModelService {
    getModel(_id: string): Promise<Monica>;
    createModel(data: IMonica): Promise<Monica>;
    updateModel(_id: string, data: Monica): Promise<boolean>;
    deleteModel(_id: string): Promise<boolean>;
}

export class ModelService {
    static modelRepository = new FirestoreRepository(ServiceConfig.DATABASE.COLLECTION.MODEL);

    static async getModel(_id: string): Promise<Monica> {
        return await this.modelRepository.get(_id);
    }

    static async createModel(data: IMonica): Promise<Monica> {
        let monicaCreate = new Monica(data).export();
        return await this.modelRepository.create(monicaCreate);
    }

    static async updateModel(_id: string, data: IMonica): Promise<boolean> {
        return await this.modelRepository.update(_id, data);
    }

    static async deleteModel(_id: string): Promise<boolean> {
        return await this.modelRepository.delete(_id);
    }
}
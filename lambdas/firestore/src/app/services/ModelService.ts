import { FireStoreRepository } from '../../libs/firestore/FireStoreRepository';
import { Monica } from '../models/monica/Monica';
import { ProjectConfig } from '../../system/ProjectConfig';

export class ModelService {
    static modelRepository = new FireStoreRepository(ProjectConfig.COLLECTIONS.MODEL);

    static async getModel(_id: string): Promise<Monica> {
        return await this.modelRepository.get(_id);
    }

    static async createModel(data: any): Promise<Monica> {
        let monicaCreate = new Monica(data).exportData();
        return await this.modelRepository.create(monicaCreate);
    }

    static async updateModel(_id: string, data: any): Promise<boolean> {
        let monicaUpdate = new Monica(data).exportData();
        return await this.modelRepository.update(_id, monicaUpdate);
    }

    static async deleteModel(_id: string): Promise<boolean> {
        return await this.modelRepository.delete(_id);
    }
}
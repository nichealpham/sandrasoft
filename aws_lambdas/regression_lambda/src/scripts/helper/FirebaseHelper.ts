import { ServiceConfig } from '../../system/Config';
import { ApiGateway } from '../../system/ApiGateway';
import { RequestHelper } from './RequestHelper';

let baseUrl = `${ApiGateway.FIREBASE.API_BASE}/${ServiceConfig.STAGE}/lambda/${ApiGateway.FIREBASE.ALIAS}`;
class FirebaseUrl {
    static getModel = (_id) => {return `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/get/${_id}`};
    static createModel = () => {return `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/create`};
    static updateModel = (_id) => {return `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/update/${_id}`};
    static deleteModel = (_id) => {return `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/delete/${_id}`};
}

export class FirebaseHelper {
    static modelService = {
        async get(_id: string): Promise<any> {
            return await RequestHelper.get(FirebaseUrl.getModel(_id));
        },
        async create(data: any): Promise<any> {
            return await RequestHelper.post(FirebaseUrl.createModel(), data);
        },
        async update(_id: string, data: any): Promise<boolean> {
            return await RequestHelper.put(FirebaseUrl.updateModel(_id), data);
        },
        async delete(_id: string): Promise<boolean> {
            return await RequestHelper.delete(FirebaseUrl.deleteModel(_id));
        }
    }
}
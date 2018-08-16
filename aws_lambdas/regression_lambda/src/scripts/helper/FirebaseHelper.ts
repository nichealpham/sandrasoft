import { RequestHelper } from './RequestHelper';
import { ServiceConfig } from '../../system/Config';
import { ApiGateway } from '../../system/ApiGateway';

let baseUrl = `${ApiGateway.FIREBASE.API_BASE}/${ServiceConfig.STAGE}/lambda/${ApiGateway.FIREBASE.ALIAS}`;
let FirebaseUrl = {
    getModel: (_id) => `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/get/${_id}`,
    createModel: () => `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/create`,
    updateModel: (_id) => `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/update/${_id}`,
    deleteModel: (_id) => `${baseUrl}/${ServiceConfig.DATABASE.COLLECTION.MODEL}/delete/${_id}`,
}

export class FirebaseHelper {
    static modelService = {
        async get(_id: string): Promise<any> {
            let result = await RequestHelper.get(FirebaseUrl.getModel(_id));
            if (result && result.data) return result.data;
            else return null;
        },
        async create(data: any): Promise<any> {
            let result = await RequestHelper.post(FirebaseUrl.createModel(), {data});
            if (result && result.data) return result.data;
            else return null;
        },
        async update(_id: string, data: any): Promise<boolean> {
            let result = await RequestHelper.put(FirebaseUrl.updateModel(_id), {data});
            if (result && result.data) return result.data;
            else return false;
        },
        async delete(_id: string): Promise<boolean> {
            let result = await RequestHelper.delete(FirebaseUrl.deleteModel(_id));
            if (result && result.data) return result.data;
            else return false;
        }
    }
}
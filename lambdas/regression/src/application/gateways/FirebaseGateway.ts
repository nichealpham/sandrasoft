import { RequestHelper } from '../../scripts/helper/RequestHelper';

let baseUrl = `https://0rri7wpdpi.execute-api.ap-southeast-1.amazonaws.com/dev/lambda/firebase`;
export class FirebaseGateway {
    static apiBase = baseUrl;
    static async getModel(_id: string): Promise<any> {
        let result = await RequestHelper.get(`${baseUrl}/model/get/${_id}`);
        if (result && result.data) return result.data;
        else return null;
    }
    static async createModel(data: any): Promise<any> {
        let result = await RequestHelper.post(`${baseUrl}/model/create`, {data});
        if (result && result.data) return result.data;
        else return null;
    }
    static async updateModel(_id: string, data: any): Promise<boolean> {
        let result = await RequestHelper.put(`${baseUrl}/model/update/${_id}`, {data});
        if (result && result.data) return result.data;
        else return false;
    }
    static async deleteModel(_id: string): Promise<boolean> {
        let result = await RequestHelper.delete(`${baseUrl}/model/delete/${_id}`);
        if (result && result.data) return result.data;
        else return false;
    }
}
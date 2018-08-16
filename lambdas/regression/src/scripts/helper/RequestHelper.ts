import * as RequestPromise from 'request-promise';

export class RequestHelper {
    static async get(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RequestPromise({
                method: 'GET',
                uri: url,
                json: true,
            }).then(data => resolve(data)).catch(error => reject(error));
        });
    }

    static async post(url: string, data): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RequestPromise({
                method: 'POST',
                uri: url,
                body: data,
                json: true,
            }).then(data => resolve(data)).catch(error => reject(error));
        });
    }

    static async put(url: string, data): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RequestPromise({
                method: 'PUT',
                uri: url,
                body: data,
                json: true,
            }).then(data => resolve(data)).catch(error => reject(error));
        });
    }

    static async delete(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            RequestPromise({
                method: 'DELETE',
                uri: url,
                json: true,
            }).then(data => resolve(data)).catch(error => reject(error));
        });
    }
}
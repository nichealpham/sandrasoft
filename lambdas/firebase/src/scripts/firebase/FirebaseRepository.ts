import { FirebaseApp } from './FirebaseApp';
import { randomBytes } from 'crypto';

export class FirebaseRepository {
    protected collectionName;

    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async get(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let docRef = FirebaseApp.firebase.ref(this.collectionName).child(_id);
            docRef.on('value', (snapshot) => {
                if (snapshot && snapshot.val())
                    resolve(snapshot.val());
                else
                    resolve(null);
            }, (error) => {
                reject(error)
            });
        });
    }
    async create(data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            data._id = generateUUID();
            let docRef = FirebaseApp.firebase.ref(this.collectionName).child(data._id);
            docRef.set(data).then(() => {
                resolve(data)
            }).catch((err) => {reject(err)});
        });
    }
    async update(_id: string, data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            data._id = _id;
            let docRef = FirebaseApp.firebase.ref(this.collectionName).child(data._id);
            docRef.once('value', (snapshot) => {
                if (snapshot && snapshot.val()) {
                    docRef.set(data).then(() => {
                        resolve(data)
                    }).catch((err) => {reject(err)});
                }
                else
                    resolve(false);
            }, (error) => {
                reject(error)
            });
        });
    }
    async delete(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let docRef = FirebaseApp.firebase.ref(this.collectionName).child(_id);
            docRef.remove().then(() => {
                resolve(true)
            }).catch((err) => {reject(err)});
        });
    }
}

function generateUUID(): string {
    return randomBytes(16).toString("hex");
}
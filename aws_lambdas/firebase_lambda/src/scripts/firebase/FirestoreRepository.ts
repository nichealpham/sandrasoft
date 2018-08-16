import { FirebaseApp } from './FirebaseApp';
import { randomBytes } from 'crypto';

export class FirestoreRepository {
    protected collectionName;

    constructor(collectionName) {
        this.collectionName = collectionName;
    }
    async get(_id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let docRef = FirebaseApp.firestore.doc(`${this.collectionName}/${_id}`);
            docRef.get().then((doc) => {
                if (!doc.exists)
                    resolve(null);
                else
                    resolve(doc.data());
            }).catch((err) => {reject(err)});
        });
    }
    async create(data: any): Promise<any> {
        data._id = generateUUID();
        return new Promise<any>((resolve, reject) => {
            let docRef = FirebaseApp.firestore.doc(`${this.collectionName}/${data._id}`);
            docRef.set(data).then(() => {resolve(data)}).catch((err) => {reject(err)});
        });
    }
    async update(_id: string, data: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            data._id = _id;
            let docRef = FirebaseApp.firestore.doc(`${this.collectionName}/${_id}`);
            docRef.update(data).then(() => {resolve(true)}).catch((err) => {reject(err)});
        });
    }
    async delete(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let docRef = FirebaseApp.firestore.doc(`${this.collectionName}/${_id}`);
            docRef.delete().then(() => {resolve(true)}).catch((err) => {reject(err)});
        });
    }
}

function generateUUID(): string {
    return randomBytes(16).toString("hex");
}
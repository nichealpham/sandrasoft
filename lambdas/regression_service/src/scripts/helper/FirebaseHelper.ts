let ServiceAccount = require('../../system/keys/FirebaseServiceAccount.json');
import { ServiceConfig } from '../../system/Config';
import * as firebase from 'firebase-admin';
import * as crypto from 'crypto';

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(ServiceAccount),
        databaseURL: ServiceConfig.FIREBASE_KEY.DATABASEURL
    });
}
let firestore = firebase.firestore();

export class FirebaseRepository {
    protected collectionName;
    constructor(collectionName) {
        this.collectionName = collectionName;
    }
    async get(_id: string): Promise<any> {
        return await FirebaseHelper.documentService.get(this.collectionName, _id);
    }
    async create(data: any): Promise<any> {
        return await FirebaseHelper.documentService.create(this.collectionName, data);
    }
    async update(_id: string, data: any): Promise<boolean> {
        return await FirebaseHelper.documentService.update(this.collectionName, _id, data);
    }
    async delete(_id: string): Promise<boolean> {
        return await FirebaseHelper.documentService.delete(this.collectionName, _id);
    }
}

export class FirebaseHelper {
    static collectionService = {
        getCollection(collectionName: string) {
            return firestore.collection(collectionName);
        },
        connectCollection(collectionName: string): FirebaseRepository {
            return new FirebaseRepository(collectionName);
        }
    }

    static documentService = {
        async get(collectionName: string, documentId: string): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                let docRef = firestore.doc(`${collectionName}/${documentId}`);
                docRef.get().then((doc) => {
                    if (!doc.exists)
                        resolve(null);
                    else
                        resolve(doc.data());
                }).catch((err) => {reject(err)});
            });
        },
        async create(collectionName: string, documentData: any):Promise<any> {
            documentData._id = generateUUID();
            return new Promise<any>((resolve, reject) => {
                let docRef = firestore.doc(`${collectionName}/${documentData._id}`);
                docRef.set(documentData).then(() => {resolve(documentData)}).catch((err) => {reject(err)});
            });
        },
        async update(collectionName: string, documentId: string, documentData: any): Promise<boolean> {
            return new Promise<boolean>(async (resolve, reject) => {
                documentData._id = documentId;
                let docRef = firestore.doc(`${collectionName}/${documentId}`);
                docRef.update(documentData).then(() => {resolve(true)}).catch((err) => {reject(err)});
            });
        },
        async delete(collectionName: string, documentId: string): Promise<boolean> {
            return new Promise<boolean>((resolve, reject) => {
                let docRef = firestore.doc(`${collectionName}/${documentId}`);
                docRef.delete().then(() => {resolve(true)}).catch((err) => {reject(err)});
            });
        }
    }
}

function generateUUID(): string {
    return crypto.randomBytes(16).toString("hex");
}
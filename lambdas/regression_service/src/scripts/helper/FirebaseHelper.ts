let ServiceAccount = require('../../system/keys/FirebaseServiceAccount.json');
import { ServiceConfig } from '../../system/Config';
import * as firebase from 'firebase-admin';
import * as crypto from 'crypto';

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(ServiceAccount),
        databaseURL: ServiceConfig.FIREBASE.databaseURL
    });
}
let firestore = firebase.firestore();

export class FirebaseHelper {
    static async createDocument(collection: string, doc: any): Promise<any> {
        doc._id = generateUUID();
        return new Promise((resolve, reject) => {
            let docRef = firestore.doc(`${collection}/${doc._id}`);
            docRef.set(doc).then(() => {resolve(doc)}).catch((err) => {reject(err)});
        });
    }
}

function generateUUID(): string {
    return crypto.randomBytes(16).toString("hex");
}
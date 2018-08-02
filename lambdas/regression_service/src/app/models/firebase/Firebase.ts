let ServiceAccount = require('../../../system/private_keys/FirebaseServiceAccount.json');
import {FIREBASE} from '../../../system/private_keys/Firebase';
import * as firebase from 'firebase-admin';
import * as crypto from 'crypto';

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(ServiceAccount),
        databaseURL: FIREBASE.databaseURL
    });
}
let firestore = firebase.firestore();

export class Firebase {
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
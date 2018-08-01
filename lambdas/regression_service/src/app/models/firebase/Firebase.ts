const ServiceAccount = require('../../../system/private_keys/FirebaseServiceAccount.json');
import {FIREBASE} from '../../../system/private_keys/Firebase';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

export class Firebase {
    firestore: any
    
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(ServiceAccount),
            databaseURL: FIREBASE.databaseURL
        });
        this.firestore = admin.firestore();
    }

    protected generateUUID(): string {
        return crypto.randomBytes(16).toString("hex");
    }

    async create(collection: string, doc: any): Promise<any> {
        doc._id = this.generateUUID();
        return new Promise((resolve, reject) => {
            let docRef = this.firestore.doc(`${collection}/${doc._id}`);
            docRef.set(doc).then(() => {resolve(doc)}).catch((err) => {reject(err)});
        });
    }
}
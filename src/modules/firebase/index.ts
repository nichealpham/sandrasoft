import * as firebase from 'firebase-admin';
import { FirestoreRepository } from './FirestoreRepository';
import { FirerayRepository } from './FirerayRepository';

export class FiresbaseApp {
    private firestore;

    constructor(serviceAccountPath: string) {
        this.firestore = this.initSDK(serviceAccountPath);
    }

    private initSDK = (serviceAccountPath: string) => {
        const config = require(serviceAccountPath);
        const dbEndpoint = `https://${config['project_id']}.firebaseio.com`;
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(config),
                databaseURL: dbEndpoint,
            });
        }
        const firestore = firebase.firestore();
        firestore.settings({ timestampsInSnapshots: true });
        return firestore;
    }

    firestoreConnect = (documentPath: string) => {
        return new FirestoreRepository(documentPath, this.firestore);
    }

    // tslint:disable-next-line: ban-types
    firerayConnect = (path: string, pattern: Object) => {
        return new FirerayRepository(path, pattern, this.firestore);
    }
}
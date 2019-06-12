import * as firebase from 'firebase-admin';
import { FirestoreRepository } from './FirestoreRepository';
import { FirerayRepository } from './FirerayRepository';

export class FiresbaseApp {
    static firestore;

    static initSDK (serviceAccountPath: string) {
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
        this.firestore = firestore;
    }

    static firestoreConnect (documentPath: string) {
        return new FirestoreRepository(documentPath, this.firestore);
    }

    // tslint:disable-next-line: ban-types
    static firerayConnect (path: string, pattern: Object) {
        return new FirerayRepository(path, pattern, this.firestore);
    }
}
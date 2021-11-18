"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiresbaseApp = void 0;
const firebase = require("firebase-admin");
const FirestoreRepository_1 = require("./FirestoreRepository");
const FirerayRepository_1 = require("./FirerayRepository");
class FiresbaseApp {
    static initSDK(serviceAccountPath) {
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
    static firestoreConnect(documentPath) {
        return new FirestoreRepository_1.FirestoreRepository(documentPath, this.firestore);
    }
    static firerayConnect(path, pattern) {
        return new FirerayRepository_1.FirerayRepository(path, pattern, this.firestore);
    }
}
exports.FiresbaseApp = FiresbaseApp;
//# sourceMappingURL=index.js.map
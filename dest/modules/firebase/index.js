"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase-admin");
const FirestoreRepository_1 = require("./FirestoreRepository");
const FirerayRepository_1 = require("./FirerayRepository");
class FiresbaseApp {
    constructor(serviceAccountPath) {
        this.initSDK = (serviceAccountPath) => {
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
        };
        this.firestoreConnect = (documentPath) => {
            return new FirestoreRepository_1.FirestoreRepository(documentPath, this.firestore);
        };
        this.firerayConnect = (path, pattern) => {
            return new FirerayRepository_1.FirerayRepository(path, pattern, this.firestore);
        };
        this.firestore = this.initSDK(serviceAccountPath);
    }
}
exports.FiresbaseApp = FiresbaseApp;
//# sourceMappingURL=index.js.map
import * as firebase from 'firebase-admin';
let ServiceAccount = require('./FirebaseServiceAccount.json');
let DatabaseUrl = 'https://sandrasofttensorflowservice.firebaseio.com';

export class FirebaseApp {
    static firebase;
    static firestore;

    static initialize() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(ServiceAccount),
                databaseURL: DatabaseUrl
            });
        }
        // Cannot use database for lambda, request freeze and timeout!
        // this.firebase = firebase.database();
        this.firestore = firebase.firestore();
    }
}
import * as firebase from 'firebase-admin';
let DatabaseUrl = 'https://sandrasofttensorflowservice.firebaseio.com';
let ServiceAccount = require('./FirebaseServiceAccount.json');

export class FirebaseApp {
    static firebase;
    static firestore;

    static initialize() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(ServiceAccount),
                databaseURL: DatabaseUrl
            });
	        console.log("\x1b[36m", '\n Firebase App Initilized Successfully !');
        }
        this.firebase = firebase.database();
        this.firestore = firebase.firestore();
    }
}
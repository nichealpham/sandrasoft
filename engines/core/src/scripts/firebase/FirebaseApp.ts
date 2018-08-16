import { ConsoleColor } from './../../application/models/common/ConsoleColor';
import * as firebase from 'firebase-admin';
let ServiceAccount = require('../../system/keys/FirebaseServiceAccount.json');
import { ServiceConfig } from '../../system/Config';

export class FirebaseApp {
    static firestore;
    static appSetting = {
        timestampsInSnapshots: true
    }

    static initialize() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(ServiceAccount),
                databaseURL: ServiceConfig.FIREBASE_KEY.DATABASEURL
            });
	        console.log(ConsoleColor.Green, '\n 2. Firebase Engine Initilize Success');
        }
        this.firestore = firebase.firestore();
    }
}
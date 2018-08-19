import * as firebase from 'firebase-admin';
let ServiceAccount = require('./ServiceAccount.json');
let DatabaseUrl = 'https://sandrasofttensorflowservice.firebaseio.com';

let FireStoreApp;
if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(ServiceAccount),
        databaseURL: DatabaseUrl
    });
};
if (!FireStoreApp) {
    FireStoreApp = firebase.firestore();
};
export default FireStoreApp;
import { FirebaseApp } from '../scripts/firebase/FirebaseApp';

export class DatabaseEngines {
    static async initialize() {
        FirebaseApp.initialize();
    }
}
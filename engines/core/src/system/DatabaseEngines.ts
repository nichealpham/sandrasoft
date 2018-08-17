import { FirebaseApp } from '../scripts/firebase/FirebaseApp';
import { MongooseApp } from './../scripts/mongoose/MongooseApp';

export class DatabaseEngines {
    static async initialize() {
        await FirebaseApp.initialize();
        await MongooseApp.initialize();
    }
}
import { FirestoreRepository } from './FirestoreRepository';
import { FirerayRepository } from './FirerayRepository';
export declare class FiresbaseApp {
    private firestore;
    constructor(serviceAccountPath: string);
    private initSDK;
    firestoreConnect: (documentPath: string) => FirestoreRepository;
    firerayConnect: (path: string, pattern: Object) => FirerayRepository;
}

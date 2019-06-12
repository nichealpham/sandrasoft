import { FirestoreRepository } from './FirestoreRepository';
import { FirerayRepository } from './FirerayRepository';
export declare class FiresbaseApp {
    static firestore: any;
    static initSDK(serviceAccountPath: string): void;
    static firestoreConnect(documentPath: string): FirestoreRepository;
    static firerayConnect(path: string, pattern: Object): FirerayRepository;
}

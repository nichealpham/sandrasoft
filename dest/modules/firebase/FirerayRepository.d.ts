import { FirestoreRepository } from './FirestoreRepository';
export declare class FirerayRepository {
    path: any;
    pattern: any;
    connections: any;
    firestore: any;
    constructor(path: string, pattern: any, firestore: any);
    connect(pattern: any): FirestoreRepository;
    getPath(pattern: any): string;
}

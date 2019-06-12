export declare class FirestoreRepository {
    protected path: any;
    protected firestore: any;
    constructor(path: string, firestore: any);
    get(_id: string): Promise<any>;
    count(queries: string[][]): Promise<number>;
    exist(queries: string[][]): Promise<boolean>;
    findOne(queries: string[][]): Promise<any>;
    search(queries: string[][], page?: number, limit?: number): Promise<any[]>;
    setDoc(data: any): Promise<any>;
    create(data: any, bytesLength?: number, encryption?: string): Promise<any>;
    update(_id: string, data: any): Promise<boolean>;
    delete(_id: string): Promise<boolean>;
}

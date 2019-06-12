import { FirestoreRepository } from './FirestoreRepository';
import * as ramda from 'ramda';

export class FirerayRepository {
    path;
    pattern;
    connections;
    firestore;

    constructor(path: string, pattern, firestore) {
        this.path = path;
        this.pattern = pattern;
        this.firestore = firestore;
        this.connections = {};
    }

    connect(pattern): FirestoreRepository {
        const params = ramda.mergeRight(this.pattern, pattern);
        let path = JSON.parse(JSON.stringify(this.path));
        Object.keys(params).forEach(name => {
            path = path.replace(`[${name}]`, params[name]);
        });
        if (!this.connections[path]) {
            this.connections[path] = new FirestoreRepository(path, this.firestore);
        }
        return this.connections[path];
    }

    getPath(pattern): string {
        const params = ramda.mergeRight(this.pattern, pattern);
        let path = JSON.parse(JSON.stringify(this.path));
        Object.keys(params).forEach(name => {
            path = path.replace(`[${name}]`, params[name]);
        });
        return path;
    }
}

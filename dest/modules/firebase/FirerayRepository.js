"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirestoreRepository_1 = require("./FirestoreRepository");
const ramda = require("ramda");
class FirerayRepository {
    constructor(path, pattern, firestore) {
        this.path = path;
        this.pattern = pattern;
        this.firestore = firestore;
        this.connections = {};
    }
    connect(pattern) {
        const params = ramda.mergeRight(this.pattern, pattern);
        let path = JSON.parse(JSON.stringify(this.path));
        Object.keys(params).forEach(name => {
            path = path.replace(`[${name}]`, params[name]);
        });
        if (!this.connections[path]) {
            this.connections[path] = new FirestoreRepository_1.FirestoreRepository(path, this.firestore);
        }
        return this.connections[path];
    }
    getPath(pattern) {
        const params = ramda.mergeRight(this.pattern, pattern);
        let path = JSON.parse(JSON.stringify(this.path));
        Object.keys(params).forEach(name => {
            path = path.replace(`[${name}]`, params[name]);
        });
        return path;
    }
}
exports.FirerayRepository = FirerayRepository;
//# sourceMappingURL=FirerayRepository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class FirestoreRepository {
    constructor(path, firestore) {
        this.path = path;
        this.firestore = firestore;
    }
    async get(_id) {
        return new Promise((resolve) => {
            this.firestore.collection(this.path).doc(_id).get().then((doc) => {
                if (!doc.exists) {
                    resolve(null);
                }
                else {
                    const data = doc.data();
                    if (data.createdAt) {
                        data.createdAt = data.createdAt.toDate();
                    }
                    if (data.updatedAt) {
                        data.updatedAt = data.updatedAt.toDate();
                    }
                    resolve(data);
                }
            }).catch(() => { resolve(null); });
        });
    }
    async count(queries) {
        return new Promise((resolve) => {
            let count = 0;
            let collection = this.firestore.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                const query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            }
            collection.select().stream().on('data', () => { ++count; }).on('end', () => {
                resolve(count);
            });
        });
    }
    async exist(queries) {
        return new Promise((resolve) => {
            let collection = this.firestore.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                const query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            }
            collection.select().stream().on('data', () => {
                collection = null;
                return resolve(true);
            }).on('end', () => {
                return resolve(false);
            });
        });
    }
    async findOne(queries) {
        return new Promise((resolve) => {
            let collection = this.firestore.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                const query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            }
            collection.stream().on('data', (doc) => {
                collection = null;
                return resolve(doc.data());
            }).on('end', () => {
                return resolve(null);
            });
        });
    }
    async search(queries, page, limit) {
        page = page || 1;
        limit = limit || 10;
        const startAt = (page - 1) * limit;
        const endBefore = startAt + limit;
        const result = [];
        return new Promise((resolve) => {
            let collection = this.firestore.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                const query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            }
            let _ind = 0;
            collection.stream().on('data', (doc) => {
                if (_ind >= startAt && _ind < endBefore) {
                    result.push(doc.data());
                }
                else if (_ind >= endBefore) {
                    collection = null;
                    return resolve(result);
                }
                _ind += 1;
            }).on('end', () => {
                return resolve(result);
            });
        });
    }
    async setDoc(data) {
        if (!data._id) {
            return null;
        }
        return new Promise((resolve) => {
            this.firestore.collection(this.path).doc(data._id).set(data).then(() => { resolve(data); }).catch(() => { resolve(null); });
        });
    }
    async create(data, bytesLength = 8, encryption = 'hex') {
        if (!data._id) {
            data._id = getRandomBytes(bytesLength, encryption);
        }
        const result = await this.setDoc(data);
        return result;
    }
    async update(_id, data) {
        return new Promise(async (resolve) => {
            data._id = _id;
            this.firestore.collection(this.path).doc(_id).update(data).then(() => { resolve(true); }).catch((err) => { resolve(false); });
        });
    }
    async delete(_id) {
        return new Promise((resolve) => {
            this.firestore.collection(this.path).doc(_id).delete().then(() => { resolve(true); }).catch((err) => { resolve(false); });
        });
    }
}
exports.FirestoreRepository = FirestoreRepository;
function getRandomBytes(bytesLength = 8, encryption = 'hex') {
    return crypto.randomBytes(bytesLength).toString(encryption);
}
//# sourceMappingURL=FirestoreRepository.js.map
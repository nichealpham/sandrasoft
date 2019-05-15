"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const logger_1 = require("../logger");
const mongo_collection_1 = require("./mongo_collection");
exports.MongoCollection = mongo_collection_1.MongoCollection;
const mongo_ultility_1 = require("./mongo_ultility");
exports.MongoUltility = mongo_ultility_1.MongoUltility;
const connections = {};
const collections = {};
class MongoDb {
    static connect(config) {
        let collection = this.findCollection(config);
        if (!collection) {
            let connection = this.findConnection(config);
            if (!connection) {
                connection = this.initConnection(config);
            }
            collection = this.initCollection(connection, config);
        }
        return collection;
    }
    static findCollection(config) {
        const secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        return collections[secreteKey];
    }
    static findConnection(config) {
        const secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        return connections[secreteKey];
    }
    static initCollection(connection, config) {
        const secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        const collection = new mongo_collection_1.MongoCollection(connection, config.modelname, config.schema);
        collections[secreteKey] = collection;
        return collection;
    }
    static initConnection(config) {
        const secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        const connection = Mongoose.createConnection(secreteKey, {
            useNewUrlParser: true,
            useCreateIndex: true,
        });
        connection.on('error', (error) => {
            logger_1.Logger.error(`Mongoose Connection Error!`);
            logger_1.Logger.error(`Message: ${error.toString()} !`);
        });
        connection.once('open', () => {
            connection[secreteKey] = connection;
            logger_1.Logger.info(`Mongoose Connection Success, db: ${config.dbname}`);
        });
        return connection;
    }
}
exports.MongoDb = MongoDb;
//# sourceMappingURL=index.js.map